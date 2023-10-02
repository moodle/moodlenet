import type { PkgExposeDef } from '@moodlenet/core'
import { npm, RpcNext, RpcStatus } from '@moodlenet/core'
import { getOrgData, setOrgData } from '@moodlenet/organization/server'
import { href } from '@moodlenet/react-app/common'
import {
  defaultImageUploadMaxSize,
  getAppearance,
  getWebappUrl,
  setAppearance,
} from '@moodlenet/react-app/server'
import type { EntityDocument } from '@moodlenet/system-entities/server'
import assert from 'assert'
import type { SchemaOf } from 'yup'
import { array, object, string } from 'yup'
import type { WebUserExposeType } from '../common/expose-def.mjs'
import type {
  ClientSessionDataRpc,
  Profile,
  ProfileGetRpc,
  UserInterests,
  WebUserData,
} from '../common/types.mjs'
import { getProfileHomePageRoutePath } from '../common/webapp-routes.mjs'
import { profileValidationSchema, validationsConfig } from './env.mjs'
import { publicFilesHttp } from './init/fs.mjs'
import { shell } from './shell.mjs'
import {
  isAllowedKnownEntityFeature,
  reduceToKnownFeaturedEntities,
} from './srv/known-features.mjs'
import {
  editMyProfileInterests,
  editProfile,
  entityFeatureAction,
  getEntityFeatureCount,
  getEntityFeatureProfiles,
  getLandingPageList,
  getProfileOwnKnownEntities,
  getProfileRecord,
  getValidations,
  searchProfiles,
  sendMessageToProfile as sendMessageToProfileIntent,
  setProfileAvatar,
  setProfileBackgroundImage,
} from './srv/profile.mjs'
import {
  currentWebUserDeletionAccountRequest,
  deleteWebUserAccountConfirmedByToken,
  getCurrentProfileIds,
  getWebUser,
  loginAsRoot,
  searchUsers,
  sendWebUserTokenCookie,
  toggleWebUserIsAdmin,
  verifyCurrentTokenCtx,
} from './srv/web-user.mjs'
import type { ProfileDataType } from './types.mjs'
import { betterTokenContext } from './util.mjs'

export const expose = await shell.expose<WebUserExposeType & ServiceRpc>({
  rpc: {
    'webapp/get-configs': {
      guard: () => void 0,
      async fn() {
        return { validations: validationsConfig }
      },
    },
    'getCurrentClientSessionDataRpc': {
      guard: () => void 0,
      async fn() {
        const verifiedCtx = await verifyCurrentTokenCtx()
        // shell.log('debug', 'getCurrentClientSessionDataRpc', verifiedCtx?.payload)
        if (!verifiedCtx) {
          sendWebUserTokenCookie(undefined)
          return
        }
        if (verifiedCtx.payload.isRoot) {
          return {
            isRoot: true,
          }
        }
        // await setCurrentVerifiedJwtToken(verifiedCtx, false)

        const webUser = await getWebUser({ _key: verifiedCtx.payload.webUser._key })
        if (!webUser) {
          sendWebUserTokenCookie(undefined)
          return
        }
        if (webUser.profileKey !== verifiedCtx.payload.profile._key) {
          shell.log(
            'warn',
            `webUser.profileKey:${webUser.profileKey} not equals verifiedCtx.payload.profile._key:${verifiedCtx.payload.profile._key}`,
          )
          sendWebUserTokenCookie(undefined)
          return
        }
        const profileRecord = await getProfileRecord(webUser.profileKey)
        if (!profileRecord) {
          shell.log(
            'warn',
            `couldn't find Profile#${webUser.profileKey} associated with WebUser#${webUser._key}:${webUser.displayName}`,
          )
          sendWebUserTokenCookie(undefined)
          return
        }

        const myProfile = profileDoc2Profile(profileRecord.entity)
        const clientSessionDataRpc: ClientSessionDataRpc = {
          isAdmin: webUser.isAdmin,
          isRoot: false,
          myProfile: { ...myProfile, webUserKey: webUser._key },
        }
        return clientSessionDataRpc
      },
    },
    'loginAsRoot': {
      guard: () => void 0,
      fn: ({ rootPassword }) => loginAsRoot(rootPassword),
    },
    'webapp/profile/:_key/edit': {
      guard: _ => {
        _.editData = profileValidationSchema.validateSync(_?.editData, { stripUnknown: true })
      },
      async fn({ editData }, { _key }) {
        const patchRecord = await editProfile(_key, editData)
        if (!patchRecord) {
          return
        }
      },
    },
    'webapp/profile/:_key/get': {
      guard: () => void 0,
      async fn(_, { _key }) {
        const profileRecord = await getProfileRecord(_key, { projectAccess: ['u'] })
        if (!profileRecord) {
          return null
        }
        const data = profileDoc2Profile(profileRecord.entity)

        const collections = (
          await getProfileOwnKnownEntities({
            knownEntity: 'collection',
            profileKey: _key,
          })
        ).map(({ entity: { _key } }) => ({ _key }))

        const resources = (
          await getProfileOwnKnownEntities({
            knownEntity: 'resource',
            profileKey: _key,
          })
        ).map(({ entity: { _key } }) => ({ _key }))

        const profileHomePagePath = getProfileHomePageRoutePath({
          _key,
          displayName: profileRecord.entity.displayName,
        })

        const currentProfileIds = await getCurrentProfileIds()
        const currToken = await verifyCurrentTokenCtx()
        const canApprove =
          !!currToken && (currToken.payload.isRoot || currToken.payload.webUser.isAdmin)

        const profileGetRpc: ProfileGetRpc = {
          canApprove,
          isPublisher: profileRecord.entity.publisher,
          canEdit: !!profileRecord.access.u,
          canFollow: !!currentProfileIds && currentProfileIds._key !== profileRecord.entity._key,
          numFollowers:
            (await getEntityFeatureCount({ _key, entityType: 'profile', feature: 'follow' }))
              ?.count ?? 0,
          numKudos: profileRecord.entity.kudos,
          profileHref: href(profileHomePagePath),
          profileUrl: getWebappUrl(profileHomePagePath),
          data,
          ownKnownEntities: {
            collections,
            resources,
          },
        }

        return profileGetRpc
      },
    },

    'webapp/upload-profile-avatar/:_key': {
      guard: async body => {
        const { avatarImageValidation } = await getValidations()
        const validatedImageOrNullish = await avatarImageValidation.validate(
          { image: body?.file?.[0] },
          { stripUnknown: true },
        )
        body.file = [validatedImageOrNullish]
      },
      async fn({ file: [uploadedRpcFile] }, { _key }) {
        const got = await getProfileRecord(_key, { projectAccess: ['u'] })

        if (!got?.access.u) {
          throw RpcStatus('Unauthorized')
        }
        const updateRes = await setProfileAvatar({ _key, rpcFile: uploadedRpcFile })

        if (!updateRes || !updateRes.patched.avatarImage) {
          return null
        }
        return publicFilesHttp.getFileUrl({
          directAccessId: updateRes.patched.avatarImage.directAccessId,
        })
      },
      bodyWithFiles: {
        maxSize: defaultImageUploadMaxSize,
        fields: {
          '.file': 1,
        },
      },
    },
    'webapp/upload-profile-background/:_key': {
      guard: async body => {
        const { backgroundImageValidation } = await getValidations()
        const validatedImageOrNullish = await backgroundImageValidation.validate(
          { image: body?.file?.[0] },
          { stripUnknown: true },
        )
        body.file = [validatedImageOrNullish]
      },
      async fn({ file: [uploadedRpcFile] }, { _key }) {
        const got = await getProfileRecord(_key, { projectAccess: ['u'] })

        if (!got?.access.u) {
          throw RpcStatus('Unauthorized')
        }

        const updateRes = await setProfileBackgroundImage({ _key, rpcFile: uploadedRpcFile })
        if (!updateRes || !updateRes.patched.backgroundImage) {
          return null
        }
        return publicFilesHttp.getFileUrl({
          directAccessId: updateRes.patched.backgroundImage.directAccessId,
        })
      },
      bodyWithFiles: {
        maxSize: defaultImageUploadMaxSize,
        fields: {
          '.file': 1,
        },
      },
    },
    'webapp/feature-entity/count/:feature(follow|like)/:entityType(profile|collection|resource|subject)/:_key':
      {
        guard: () => void 0,
        async fn(_, { _key, entityType, feature }) {
          if (!isAllowedKnownEntityFeature({ entityType, feature })) {
            return { count: 0 }
          }
          const countRes = await getEntityFeatureCount({ _key, entityType, feature })
          // shell.log('debug', [countRes?.count ?? 0, _key, entityType, feature])

          return countRes ?? { count: 0 }
        },
      },
    'webapp/feature-entity/profiles/:feature(follow|like)/:entityType(profile|collection|resource|subject)/:_key':
      {
        guard: () => void 0,
        async fn(_, { _key, entityType, feature }, paging) {
          if (!isAllowedKnownEntityFeature({ entityType, feature })) {
            return { profiles: [] }
          }
          const cursor = await getEntityFeatureProfiles({ _key, entityType, feature, paging })
          const all = await cursor.all()
          return {
            profiles: all.map(({ entity: { _key } }) => ({ _key })),
          }
        },
      },
    'webapp/all-my-featured-entities': {
      guard: () => void 0,
      async fn() {
        const myProfileIds = await getCurrentProfileIds()
        if (!myProfileIds) {
          return null
        }
        const profileRec = await getProfileRecord(myProfileIds._key)
        if (!profileRec) {
          return null
        }
        return {
          featuredEntities: reduceToKnownFeaturedEntities(profileRec.entity.knownFeaturedEntities),
        }
      },
    },
    'webapp/my-interests/get': {
      guard: () => void 0,
      async fn() {
        const myProfileIds = await getCurrentProfileIds()
        if (!myProfileIds) {
          return null
        }
        const profileRec = await getProfileRecord(myProfileIds._key)
        if (!profileRec) {
          return null
        }
        return {
          myInterests: {
            languages: profileRec.entity.profileInterests.languages,
            levels: profileRec.entity.profileInterests.levels,
            licenses: profileRec.entity.profileInterests.licenses,
            subjects: profileRec.entity.profileInterests.subjects,
            useAsDefaultSearchFilter: !!profileRec.entity.useMyProfileInterestsAsDefaultFilters,
          },
        }
      },
    },
    'webapp/my-interests/save': {
      guard: body => {
        const schema: SchemaOf<Omit<UserInterests, 'useAsDefaultSearchFilter'>> = object({
          subjects: array().of(string().required()).required(),
          licenses: array().of(string().required()).required(),
          levels: array().of(string().required()).required(),
          languages: array().of(string().required()).required(),
        }).required()
        const myInterests = schema.validateSync(body.myInterests, { stripUnknown: true })
        body.myInterests = myInterests
      },
      async fn({ myInterests }) {
        return editMyProfileInterests({ profileInterests: myInterests })
      },
    },
    'webapp/my-interests/use-as-default-search-filters': {
      guard: body => typeof body.use === 'boolean',
      async fn({ use }) {
        return editMyProfileInterests({ useMyProfileInterestsAsDefaultFilters: use })
      },
    },
    'webapp/send-message-to-user/:profileKey': {
      //@ALE TODO
      guard: () => void 0,
      async fn({ message }, { profileKey }) {
        sendMessageToProfileIntent({ message, profileKey })
      },
    },
    'webapp/entity-social-actions/:action(add|remove)/:feature(bookmark|follow|like)/:entityType(resource|profile|collection|subject)/:_key':
      {
        guard: () => void 0,
        async fn(_, { _key, action, entityType, feature }) {
          const currentProfileIds = await getCurrentProfileIds()
          assert(currentProfileIds)
          await entityFeatureAction({
            _key,
            action,
            entityType,
            feature,
            profileKey: currentProfileIds._key,
          })
          return
        },
      },
    'webapp/landing/get-list/:entityType(collections|resources|profiles)': {
      guard: () => void 0,
      async fn(_, { entityType }, { limit }) {
        const entities = await getLandingPageList(entityType, limit)
        return entities.map(({ entity: { _key } }) => ({ _key }))
      },
    },
    'webapp/search': {
      guard: () => void 0,
      async fn(_, __, { limit, sortType, text, after }) {
        const { endCursor, list } = await searchProfiles({
          limit,
          sortType,
          text,
          after,
        })
        return {
          list: list.map(({ entity: { _key } }) => ({ _key })),
          endCursor,
        }
      },
    },
    'webapp/web-user/delete-account-request': {
      guard: () => void 0,
      async fn() {
        currentWebUserDeletionAccountRequest()
      },
    },
    'webapp/web-user/delete-account-request/confirm/:token': {
      guard: () => void 0,
      async fn(_, { token }) {
        const result = await deleteWebUserAccountConfirmedByToken(token)
        if (!result) {
          throw RpcStatus('Unauthorized')
        }
        if (result.status === 'done') {
          return
        }
        throw RpcStatus('Unprocessable Entity', result.status)
      },
    },
    'webapp/react-app/get-org-data': {
      guard: () => void 0,
      fn: getOrgData,
    },
    'webapp/react-app/get-appearance': {
      guard: () => void 0,
      fn: getAppearance,
    },
    'webapp/admin/*': {
      guard: () => void 0,
      fn: async () => {
        const _ = await betterTokenContext()
        if (!_.isRootOrAdmin) {
          throw RpcStatus('Unauthorized')
        }
        throw RpcNext()
      },
    },
    'webapp/admin/roles/searchUsers': {
      guard: () => void 0,
      async fn({ search }) {
        const users_and_profiles = await searchUsers(search)
        const webUsers = Promise.all(
          users_and_profiles.map(user => {
            return getProfileRecord(user.profileKey).then(profile => {
              assert(
                profile,
                `RPC 'webapp/admin/roles/searchUsers': found user but not profile! (webUserKey:${user._key} | profileKey:${user.profileKey})`,
              )

              const webUserData: WebUserData = {
                _key: user._key,
                isAdmin: user.isAdmin,
                name: user.displayName,
                isPublisher: profile.entity.publisher,
                profileKey: user.profileKey,
                profileHomePath: getProfileHomePageRoutePath({
                  _key: profile.entity._key,
                  displayName: profile.entity.displayName,
                }),
                //@BRU actually email *could* not be defined for a web-user,
                // using our email authentication it will always be indeed..
                // but with some other auth system it may not
                // indeed a web user would need to have at least 1 contact/message/notification method
                // be it an email or something else ...
                email: user.contacts.email ?? 'N/A',
              }
              return webUserData
            })
          }),
        )
        return webUsers
      },
    },
    'webapp/admin/roles/toggleIsAdmin': {
      guard: () => void 0,
      async fn(by) {
        const patchedUser = await toggleWebUserIsAdmin(by)
        return !!patchedUser
      },
    },
    'webapp/admin/roles/toggleIsPublisher': {
      guard: () => void 0,
      async fn({ profileKey }) {
        const profile = await getProfileRecord(profileKey)
        const patchedProfile =
          profile && (await editProfile(profileKey, { publisher: !profile.entity.publisher }))
        return !!patchedProfile
      },
    },
    'webapp/admin/general/set-org-data': {
      guard: () => void 0,
      fn: setOrgData,
    },
    'webapp/admin/general/set-appearance': {
      guard: () => void 0,
      fn: setAppearance,
    },
    'webapp/admin/packages/update-all-pkgs': {
      guard: () => void 0,
      fn: () => npm.updateAll(),
    },
  },
})

type ServiceRpc = PkgExposeDef<{
  rpc: {
    'webapp/admin/*'(): Promise<never>
    'webapp/web-user/delete-account-request/confirm/:token'(
      body: void,
      params: { token: string },
    ): Promise<void>
  }
}>

function profileDoc2Profile(entity: EntityDocument<ProfileDataType>) {
  const backgroundUrl = entity.backgroundImage
    ? publicFilesHttp.getFileUrl({
        directAccessId: entity.backgroundImage.directAccessId,
      })
    : undefined
  const avatarUrl = entity.avatarImage
    ? publicFilesHttp.getFileUrl({
        directAccessId: entity.avatarImage.directAccessId,
      })
    : undefined
  const profile: Profile & { publisher: boolean } = {
    _key: entity._key,
    aboutMe: entity.aboutMe ?? '',
    avatarUrl,
    backgroundUrl,
    displayName: entity.displayName,
    location: entity.location ?? '',
    organizationName: entity.organizationName ?? '',
    siteUrl: entity.siteUrl ?? '',
    publisher: entity.publisher,
  }
  return profile
}
