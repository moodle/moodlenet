import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import { npm, RpcNext, RpcStatus, setRpcStatusCode } from '@moodlenet/core'
import { resource } from '@moodlenet/core-domain'
import { getSubjectHomePageRoutePath } from '@moodlenet/ed-meta/common'
import type { ResourceRpc } from '@moodlenet/ed-resource/common'
import { getResourceHomePageRoutePath } from '@moodlenet/ed-resource/common'
import * as EdResource from '@moodlenet/ed-resource/server'
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
import { array, boolean, object, string } from 'yup'
import type { ResourceExposeType } from '../common/expose-def-ed-resource.mjs'
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
  setProfilePublisherFlag,
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
import { createNewResource, reviveInterpreterAndMachine } from './xsm/resource/machines.mjs'

export const expose = await shell.expose<
  WebUserExposeType & ServiceRpc & ResourceExposeType & ServerResourceExposeType
>({
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

        const [collections, resources, currentProfileIds, currToken, numFollowers] =
          await Promise.all([
            getProfileOwnKnownEntities({
              knownEntity: 'collection',
              profileKey: _key,
            }).then(_ => _.map(({ entity: { _key } }) => ({ _key }))),

            getProfileOwnKnownEntities({
              knownEntity: 'resource',
              profileKey: _key,
            }).then(_ => _.map(({ entity: { _key } }) => ({ _key }))),
            getCurrentProfileIds(),
            verifyCurrentTokenCtx(),
            getEntityFeatureCount({ _key, entityType: 'profile', feature: 'follow' }).then(
              _ => _?.count ?? 0,
            ),
          ])

        const profileHomePagePath = getProfileHomePageRoutePath({
          _key,
          displayName: profileRecord.entity.displayName,
        })

        const canApprove =
          !!currToken && (currToken.payload.isRoot || currToken.payload.webUser.isAdmin)

        const profileGetRpc: ProfileGetRpc = {
          canApprove,
          isPublisher: profileRecord.entity.publisher,
          canEdit: !!profileRecord.access.u,
          canFollow: !!currentProfileIds && currentProfileIds._key !== profileRecord.entity._key,
          numFollowers,
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
          interests: !profileRec.entity.settings.interests?.items
            ? undefined
            : {
                languages: profileRec.entity.settings.interests.items.languages,
                levels: profileRec.entity.settings.interests.items.levels,
                licenses: profileRec.entity.settings.interests.items.licenses,
                subjects: profileRec.entity.settings.interests.items.subjects,
              },
          asDefaultFilters: profileRec.entity.settings.interests?.asDefaultFilters,
        }
      },
    },
    'webapp/my-interests/save': {
      guard: body => {
        const schema: SchemaOf<UserInterests> = object({
          subjects: array().of(string().required()).required(),
          licenses: array().of(string().required()).required(),
          levels: array().of(string().required()).required(),
          languages: array().of(string().required()).required(),
        }).required()
        const interests = schema.validateSync(body.interests, { stripUnknown: true })
        body.interests = interests
      },
      async fn({ interests }) {
        return editMyProfileInterests({ items: interests })
      },
    },
    'webapp/my-interests/use-as-default-search-filters': {
      guard: body => typeof body.use === 'boolean',
      async fn({ use }) {
        return editMyProfileInterests({ asDefaultFilters: use })
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
        const response = await setProfilePublisherFlag({ profileKey, publisher: 'toggle' })
        return !!response?.ok
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
    // RESOURCE
    'ed-resource/webapp/get-configs': {
      guard: () => void 0,
      async fn() {
        const { config } = await EdResource.getValidations()
        return { validations: config }
      },
    },
    'ed-resource/webapp/set-is-published/:_key': {
      guard: _ =>
        object({
          publish: boolean().required(),
        }).isValid(_),
      fn: async ({ publish }, { _key }) => {
        const { interpreter } = await reviveInterpreterAndMachine(_key)
        let snap = interpreter.getSnapshot()
        if (!(publish ? snap.can('request-publish') : snap.can('set-draft'))) {
          return { done: false }
        }
        interpreter.send(publish ? 'request-publish' : 'set-draft')
        snap = interpreter.getSnapshot()
        if (resource.lifecycle.matchState(snap, 'Publishing-Moderation')) {
          shell.initiateCall(() => {
            interpreter.send('accept-publishing')
          })
        }

        return { done: true }
      },
    },
    'ed-resource/webapp/get/:_key': {
      guard: () => void 0,
      fn: async (_, { _key }) => {
        const { interpreter, resourceRecord } = await reviveInterpreterAndMachine(_key)
        const snap = interpreter.getSnapshot()
        if (!resource.lifecycle.matchState(snap, 'Access-Denied') || !resourceRecord) {
          return null
        }
        const image = EdResource.getImageAssetInfo(snap.context.draft.image?.ref)

        const contentUrl =
          snap.context.draft.content.kind === 'file'
            ? await EdResource.getResourceFileUrl({
                _key,
                rpcFile: snap.context.draft.content.ref.fsItem.rpcFile,
              })
            : snap.context.draft.content.ref.url

        const resourceRpc: ResourceRpc = {
          contributor: {
            avatarUrl: resourceRecord.contributor.iconUrl,
            creatorProfileHref: {
              url: resourceRecord.contributor.homepagePath,
              ext: false,
            },
            displayName: resourceRecord.contributor.name,
            timeSinceCreation: resourceRecord.meta.created,
          },
          resourceForm: {
            description: resourceRecord.entity.description,
            title: resourceRecord.entity.title,
            license: resourceRecord.entity.license,
            subject: resourceRecord.entity.subject,
            language: resourceRecord.entity.language,
            level: resourceRecord.entity.level,
            month: resourceRecord.entity.month,
            year: resourceRecord.entity.year,
            type: resourceRecord.entity.type,
            learningOutcomes: resourceRecord.entity.learningOutcomes,
          },
          data: {
            contentType: resourceRecord.entity.content?.kind ?? null,
            contentUrl,
            downloadFilename:
              resourceRecord.entity.content?.kind === 'file'
                ? resourceRecord.entity.content.fsItem.rpcFile.name
                : null,
            id: resourceRecord.entity._key,
            mnUrl: getWebappUrl(
              getResourceHomePageRoutePath({ _key, title: resourceRecord.entity.title }),
            ),
            image,
            subjectHref: resourceRecord.entity.subject
              ? href(
                  getSubjectHomePageRoutePath({
                    _key: resourceRecord.entity.subject,
                    title: resourceRecord.entity.subject,
                  }),
                )
              : null,
          },
          state: { isPublished: resourceRecord.entity.published },
          access: {
            canDelete: !!resourceRecord.access.d,
            canEdit: !!resourceRecord.access.u,
            canPublish: resourceRecord.canPublish,
            isCreator: resourceRecord.isCreator,
          },
        }

        return resourceRpc
      },
    },
    'ed-resource/webapp/edit/:_key': {
      guard: async body => {
        const { draftResourceValidationSchema } = await EdResource.getValidations()
        body.values = await draftResourceValidationSchema.validate(body?.values, {
          stripUnknown: true,
        })
      },
      fn: async ({ values }, { _key }) => {
        const { interpreter } = await reviveInterpreterAndMachine(_key)
        const snap = interpreter.getSnapshot()
        const updateWith: Partial<resource.lifecycle.EditDraftForm> = {
          description: values.description,
          language: values.language,
          learningOutcomes: values.learningOutcomes.filter(({ sentence }) => !!sentence),
          level: values.level,
          license: values.license,
          month: values.month,
          year: values.year,
          title: values.title,
          subject: values.subject,
          type: values.type,
          image:
            !values.image || values.image.type === 'no-change'
              ? { type: 'no-change' }
              : values.image.type === 'remove'
              ? { type: 'remove' }
              : values.image.type === 'file'
              ? {
                  type: 'update',
                  provide: { kind: 'file', rpcFile: values.image.file, info: values.image.file },
                }
              : { type: 'no-change' },
        }

        if (!snap.can({ type: 'edit-draft-meta', updateWith })) {
          return //throw ?
        }
        interpreter.send({ type: 'edit-draft-meta', updateWith })
        return
      },
    },
    'basic/v1/create': {
      guard: async body => {
        const { draftResourceValidationSchema, draftContentValidationSchema } =
          await EdResource.getValidations()
        await draftContentValidationSchema.validate({ content: body?.resource })
        await draftResourceValidationSchema.validate(body, {
          stripUnknown: true,
        })
      },
      fn: async ({ name, description, resource }) => {
        const resourceContent = [resource].flat()[0]
        if (!resourceContent) {
          throw RpcStatus('Bad Request')
        }
        const createResponse = await createNewResource(
          'string' === typeof resourceContent
            ? { kind: 'link', url: resourceContent }
            : { kind: 'file', info: resourceContent, rpcFile: resourceContent },
        )
        if (createResponse === 'invalid content') {
          throw RpcStatus('Bad Request')
        }
        if (createResponse === 'unauthorized') {
          throw RpcStatus('Internal Server Error')
        }
        if (!createResponse.success) {
          throw new Error(createResponse.reason)
        }

        setRpcStatusCode('Created')
        const snap = createResponse.interpreter.getSnapshot()
        const content = snap.context.draft.content
        const url =
          content.kind === 'file'
            ? await EdResource.getResourceFileUrl({
                _key: createResponse.resourceKey,
                rpcFile: content.ref.fsItem.rpcFile,
              })
            : content.ref.url

        return {
          _key: createResponse.resourceKey,
          description,
          homepage: getWebappUrl(
            getResourceHomePageRoutePath({ _key: createResponse.resourceKey, title: name }),
          ),
          name,
          url,
        }
      },
      bodyWithFiles: {
        fields: {
          '.resource': 1,
        },
        maxSize: EdResource.validationsConfigs.contentMaxUploadSize,
      },
    },

    'ed-resource/webapp/trash/:_key': {
      guard: () => void 0,
      fn: async (_, { _key }) => {
        const { interpreter } = await reviveInterpreterAndMachine(_key)
        interpreter.send('trash')
        return
      },
    },
    // 'ed-resource/webapp/set-image/:_key': {
    //   guard: async body => {
    //     const { imageValidationSchema } = await EdResource.getValidations()
    //     const validatedImageOrNullish = await imageValidationSchema.validate(
    //       { image: body?.file?.[0] },
    //       { stripUnknown: true },
    //     )
    //     body.file = [validatedImageOrNullish]
    //   },
    //   async fn({ file: [uploadedRpcFile] }, { _key }) {
    //     const { interpreter, resourceRecord, machine } = await reviveInterpreterAndMachine(_key)
    //     if()
    //     const got = await getResource(_key, { projectAccess: ['u'] })

    //     if (!got?.access.u) {
    //       throw RpcStatus('Unauthorized')
    //     }
    //     const updateRes = await setResourceImage(_key, uploadedRpcFile)
    //     if (updateRes === false) {
    //       throw RpcStatus('Bad Request')
    //     }
    //     if (!updateRes) {
    //       return null
    //     }
    //     const imageUrl = updateRes.patched.image && getImageUrl(updateRes.patched.image)
    //     return imageUrl
    //   },
    //   bodyWithFiles: {
    //     fields: {
    //       '.file': 1,
    //     },
    //     maxSize: defaultImageUploadMaxSize,
    //   },
    // },
    'ed-resource/webapp/create': {
      guard: async body => {
        const { publishedContentValidationSchema } = await EdResource.getValidations()
        const validatedContentOrNullish = await publishedContentValidationSchema.validate(
          { content: body?.content?.[0] },
          { stripUnknown: true },
        )
        body.content = [validatedContentOrNullish]
      },
      async fn({ content: [resourceContent] }) {
        if (!resourceContent) {
          throw RpcStatus('Bad Request')
        }
        const createResponse = await createNewResource(
          'string' === typeof resourceContent
            ? { kind: 'link', url: resourceContent }
            : { kind: 'file', info: resourceContent, rpcFile: resourceContent },
        )
        if (createResponse === 'invalid content') {
          throw RpcStatus('Bad Request')
        }
        if (createResponse === 'unauthorized') {
          throw RpcStatus('Unauthorized')
        }
        if (!createResponse.success) {
          throw new Error(createResponse.reason)
        }

        return { _key: createResponse.resourceKey }
      },
      bodyWithFiles: {
        fields: {
          '.content': 1,
        },
        maxSize: EdResource.validationsConfigs.contentMaxUploadSize,
      },
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
type ServerResourceExposeType = {
  rpc: {
    'basic/v1/create'(body: {
      name: string
      description: string
      resource: string | [RpcFile]
    }): Promise<{
      _key: string
      name: string
      description: string
      url: string
      homepage: string
    }>
  }
}

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
