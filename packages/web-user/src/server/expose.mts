import { Collection } from '@moodlenet/collection/server'
import type { PkgExposeDef } from '@moodlenet/core'
import { npm, RpcStatus } from '@moodlenet/core'
import { Resource } from '@moodlenet/ed-resource/server'
import { getOrgData, setOrgData } from '@moodlenet/organization/server'
import { href } from '@moodlenet/react-app/common'
import { getAppearance, getWebappUrl, setAppearance } from '@moodlenet/react-app/server'
import type { EntityDocument } from '@moodlenet/system-entities/server'
import { isCreatorOfCurrentEntity, queryEntities, toaql } from '@moodlenet/system-entities/server'
import assert from 'assert'
import type { WebUserExposeType } from '../common/expose-def.mjs'
import type { ClientSessionDataRpc, Profile, ProfileGetRpc, WebUserData } from '../common/types.mjs'
import { getProfileHomePageRoutePath } from '../common/webapp-routes.mjs'
import { WebUserEntitiesTools } from './entities.mjs'
import { publicFilesHttp } from './init/fs.mjs'
import {
  isAllowedKnownEntityFeature,
  reduceToKnownFeaturedEntities,
} from './lib/known-features.mjs'
import {
  editProfile,
  entityFeatureAction,
  getEntityFeatureCount,
  getLandingPageList,
  getProfileRecord,
  searchProfiles,
  sendMessageToProfile as sendMessageToProfileIntent,
  setProfileAvatar,
  setProfileBackgroundImage,
} from './lib/profile.mjs'
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
} from './lib/web-user.mjs'
import { shell } from './shell.mjs'
import type { ProfileDataType } from './types.mjs'

export const expose = await shell.expose<WebUserExposeType & ServiceRpc>({
  rpc: {
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
        assert(
          webUser.profileKey === verifiedCtx.payload.profile._key,
          `webUser.profileKey:${webUser.profileKey} not equals verifiedCtx.payload.profile._key:${verifiedCtx.payload.profile._key}`,
        )
        const profileRecord = await getProfileRecord(webUser.profileKey)
        assert(
          profileRecord,
          `couldn't find Profile#${webUser.profileKey} associated with WebUser#${webUser._key}:${webUser.displayName}`,
        )

        const myProfile = profileDoc2Profile(profileRecord.entity)
        const clientSessionDataRpc: ClientSessionDataRpc = {
          isAdmin: webUser.isAdmin,
          isRoot: false,
          myProfile,
        }
        return clientSessionDataRpc
      },
    },
    'loginAsRoot': {
      guard: () => void 0,
      fn: ({ rootPassword }) => loginAsRoot(rootPassword),
    },
    'webapp/profile/edit': {
      guard: () => void 0,
      async fn(profileFormValues) {
        const { _key, ...editRequest } = profileFormValues
        const patchRecord = await editProfile(_key, editRequest)
        if (!patchRecord) {
          return
        }
      },
    },
    'webapp/profile/get': {
      guard: () => void 0,
      async fn({ _key }) {
        const profileRecord = await getProfileRecord(_key, { projectAccess: ['u'] })
        if (!profileRecord) {
          return
        }
        const data = profileDoc2Profile(profileRecord.entity)
        const { entityIdentifier: profileIdentifier } = WebUserEntitiesTools.getIdentifiersByKey({
          _key,
          type: 'Profile',
        })
        const collections = (
          await (
            await shell.call(queryEntities)(Collection.entityClass, {
              preAccessBody: `FILTER ${isCreatorOfCurrentEntity(toaql(profileIdentifier))}`,
            })
          ).all()
        ).map(({ entity: { _key } }) => ({ _key }))
        const profileHomePagePath = getProfileHomePageRoutePath({
          _key,
          displayName: profileRecord.entity.displayName,
        })
        const resources = (
          await (
            await shell.call(queryEntities)(Resource.entityClass, {
              preAccessBody: `FILTER ${isCreatorOfCurrentEntity(toaql(profileIdentifier))}`,
            })
          ).all()
        ).map(({ entity: { _key } }) => ({ _key }))
        const currentProfileIds = await getCurrentProfileIds()
        const profileGetRpc: ProfileGetRpc = {
          canEdit: !!profileRecord.access.u,
          canFollow: !!currentProfileIds && currentProfileIds._key !== profileRecord.entity._key,
          numFollowers: profileRecord.entity.popularity?.items.followers?.value ?? 0,
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
    'webapp/roles/searchUsers': {
      guard: () => void 0,
      async fn({ search }) {
        const users = await searchUsers(search)
        const webUsers = users.map<WebUserData>(user => {
          return {
            _key: user._key,
            isAdmin: user.isAdmin,
            name: user.displayName,
            //@BRU actually email *could* not be defined for a web-user,
            // using our email authentication it will always be indeed..
            // but with some other auth system it may not
            // indeed a web user would need to have at least 1 contact/message/notification method
            // be it an email or something else ...
            email: user.contacts.email ?? '',
          }
        })
        return webUsers
      },
    },
    'webapp/roles/toggleIsAdmin': {
      guard: () => void 0,
      async fn(by) {
        const patchedUser = await toggleWebUserIsAdmin(by)
        return !!patchedUser
      },
    },
    'webapp/upload-profile-avatar/:_key': {
      guard: () => void 0,
      async fn({ file: [uploadedRpcFile] }, { _key }) {
        const got = await getProfileRecord(_key, { projectAccess: ['u'] })

        if (!got?.access.u) {
          throw RpcStatus('Unauthorized')
        }
        const patched = await setProfileAvatar({ _key, rpcFile: uploadedRpcFile })
        if (!patched?.entity.avatarImage) {
          return null
        }
        return publicFilesHttp.getFileUrl({
          directAccessId: patched.entity.avatarImage.directAccessId,
        })
      },
      bodyWithFiles: {
        fields: {
          '.file': 1,
        },
      },
    },
    'webapp/upload-profile-background/:_key': {
      guard: () => void 0,
      async fn({ file: [uploadedRpcFile] }, { _key }) {
        const got = await getProfileRecord(_key, { projectAccess: ['u'] })

        if (!got?.access.u) {
          throw RpcStatus('Unauthorized')
        }

        const patched = await setProfileBackgroundImage({ _key, rpcFile: uploadedRpcFile })
        if (!patched?.entity.backgroundImage) {
          return null
        }
        return publicFilesHttp.getFileUrl({
          directAccessId: patched.entity.backgroundImage.directAccessId,
        })
      },
      bodyWithFiles: {
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
    'webapp/all-my-featured-entities': {
      guard: () => void 0,
      async fn() {
        const myProfile = await getCurrentProfileIds()
        if (!myProfile) {
          return null
        }
        const profileRec = await getProfileRecord(myProfile._key)
        if (!profileRec) {
          return null
        }
        return {
          featuredEntities: reduceToKnownFeaturedEntities(profileRec.entity.knownFeaturedEntities),
        }
      },
    },
    'webapp/profile-kudos-count/:profileKey': {
      // REMOVE? ( kudos in entity data )
      guard: () => void 0,
      async fn(/* _, { profileKey } */) {
        return { count: 10 }
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
          await entityFeatureAction({ _key, action, entityType, feature })
          return
        },
      },
    'webapp/landing/get-list/:entityType(collections|resources|profiles)': {
      guard: () => void 0,
      async fn(_, { entityType }) {
        const entities = await getLandingPageList(entityType)
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
        await deleteWebUserAccountConfirmedByToken(token)
        return
      },
    },
    'webapp/admin/general/get-org-data': {
      guard: () => void 0,
      fn: getOrgData,
    },
    'webapp/admin/general/set-org-data': {
      guard: () => void 0,
      fn: setOrgData,
    },
    'webapp/admin/general/get-appearance': {
      guard: () => void 0,
      fn: getAppearance,
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
  const profile: Profile = {
    _key: entity._key,
    aboutMe: entity.aboutMe ?? '',
    avatarUrl,
    backgroundUrl,
    displayName: entity.displayName,
    location: entity.location ?? '',
    organizationName: entity.organizationName ?? '',
    siteUrl: entity.siteUrl ?? '',
  }
  return profile
}
