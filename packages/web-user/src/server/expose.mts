import { Collection, CollectionEntitiesTools } from '@moodlenet/collection/server'
import { RpcStatus } from '@moodlenet/core'
import { EdResourceEntitiesTools, Resource } from '@moodlenet/ed-resource/server'
import { webImageResizer } from '@moodlenet/react-app/server'
import type { EntityDocument } from '@moodlenet/system-entities/server'
import { isCreatorOfCurrentEntity, queryEntities, toaql } from '@moodlenet/system-entities/server'
import assert from 'assert'
import type { WebUserExposeType } from '../common/expose-def.mjs'
import type {
  ClientSessionDataRpc,
  KnownEntityFeature,
  KnownEntityType,
  KnownFeaturedEntities,
  Profile,
  ProfileGetRpc,
  WebUserData,
} from '../common/types.mjs'
import { WebUserEntitiesTools } from './entities.mjs'
import { publicFiles, publicFilesHttp } from './init/fs.mjs'
import { shell } from './shell.mjs'
import type { KnownFeaturedEntityItem, ProfileDataType } from './types.mjs'
import { loginAsRoot, sendWebUserTokenCookie, verifyCurrentTokenCtx } from './web-user-auth-lib.mjs'
import {
  editProfile,
  getCurrentProfile,
  getProfileAvatarLogicalFilename,
  getProfileImageLogicalFilename,
  getProfileRecord,
  getWebUser,
  searchUsers,
  toggleWebUserIsAdmin,
} from './web-user-lib.mjs'

export const expose = await shell.expose<WebUserExposeType>({
  rpc: {
    'getCurrentClientSessionDataRpc': {
      guard: () => void 0,
      async fn() {
        const verifiedCtx = await verifyCurrentTokenCtx()
        console.log('getCurrentClientSessionDataRpc', { verifiedCtx })
        if (!verifiedCtx) {
          sendWebUserTokenCookie(undefined)
          return
        }
        const { currentWebUser } = verifiedCtx
        if (currentWebUser.isRoot) {
          return {
            isRoot: true,
          }
        }
        // await setCurrentVerifiedJwtToken(verifiedCtx, false)

        const webUser = await getWebUser({ _key: currentWebUser.webUserKey })
        if (!webUser) {
          sendWebUserTokenCookie(undefined)
          return
        }
        assert(
          webUser.profileKey === currentWebUser.profileKey,
          `webUser.profileKey:${webUser.profileKey} not equals currentWebUser.profileKey:${currentWebUser.profileKey}`,
        )
        const profileRecord = await getProfileRecord(currentWebUser.profileKey)
        assert(
          profileRecord,
          `couldn't find Profile#${currentWebUser.profileKey} associated with WebUser#${currentWebUser.webUserKey}:${webUser.displayName}`,
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

        const resources = (
          await (
            await shell.call(queryEntities)(Resource.entityClass, {
              preAccessBody: `FILTER ${isCreatorOfCurrentEntity(toaql(profileIdentifier))}`,
            })
          ).all()
        ).map(({ entity: { _key } }) => ({ _key }))

        const profileGetRpc: ProfileGetRpc = {
          canEdit: !!profileRecord.access.u,
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
        const avatarLogicalFilename = getProfileAvatarLogicalFilename(_key)
        if (!uploadedRpcFile) {
          await publicFiles.del(avatarLogicalFilename)
          await editProfile(_key, {
            avatarImage: null,
          })
          return null
        }

        const resizedRpcFile = await webImageResizer(uploadedRpcFile, 'image')

        const { directAccessId } = await publicFiles.store(avatarLogicalFilename, resizedRpcFile)

        await editProfile(_key, {
          avatarImage: { kind: 'file', directAccessId },
        })
        return publicFilesHttp.getFileUrl({ directAccessId })
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
        const imageLogicalFilename = getProfileImageLogicalFilename(_key)
        if (!uploadedRpcFile) {
          await publicFiles.del(imageLogicalFilename)
          await editProfile(_key, {
            backgroundImage: null,
          })
          return null
        }

        const resizedRpcFile = await webImageResizer(uploadedRpcFile, 'image')

        const { directAccessId } = await publicFiles.store(imageLogicalFilename, resizedRpcFile)

        await editProfile(_key, {
          backgroundImage: { kind: 'file', directAccessId },
        })
        return publicFilesHttp.getFileUrl({ directAccessId })
      },
      bodyWithFiles: {
        fields: {
          '.file': 1,
        },
      },
    },
    '_____REMOVE_ME____webapp/feature-entity/:action(add|remove)/:feature(bookmark|follow|like)/:entity_id':
      {
        guard: () => void 0,
        async fn(/* _,{action,entity_id,feature} */) {
          return
        },
      },
    'webapp/feature-entity/count/:feature(follow|like)/:entity_id': {
      guard: () => void 0,
      async fn(/* _, { entity_id, feature } */) {
        return { count: 1 }
      },
    },
    'webapp/all-my-featured-entities': {
      guard: () => void 0,
      async fn() {
        const myProfile = await getCurrentProfile()
        if (!myProfile) {
          return null
        }
        return {
          featuredEntities: reduceToKnownFeaturedEntities(myProfile.knownFeaturedEntities),
        }
      },
    },
    'webapp/profile-kudos-count/:profileKey': {
      guard: () => void 0,
      async fn(/* _, { profileKey } */) {
        return { count: 10 }
      },
    },

    'webapp/send-message-to-user/:profileKey': {
      guard: () => void 0,
      async fn(/* _,{profileKey} */) {
        return
      },
    },

    'webapp/entity-social-actions/:action(add|remove)/:feature(bookmark|follow|like)/:entityType(resource|profile|collection)/:_key':
      {
        guard: () => void 0,
        async fn(/* _,{profileKey} */) {
          return
        },
      },

    '____REMOVE_ME____webapp/entity-social-status/:feature(bookmark|follow|like)/:entityType(resource|profile|collection)/:_key':
      {
        guard: () => void 0,
        async fn(/* _,{profileKey} */) {
          return Math.random() > 0.5
        },
      },
  },
})

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

function reduceToKnownFeaturedEntities(
  knownFeaturedEntities: KnownFeaturedEntityItem[],
): KnownFeaturedEntities {
  const myFeaturedEntities: KnownFeaturedEntities = {
    bookmark: {
      collection: extractFeaturedIdentifiers('Collection', 'bookmark'),
      profile: extractFeaturedIdentifiers('Profile', 'bookmark'),
      resource: extractFeaturedIdentifiers('Resource', 'bookmark'),
    },
    follow: {
      collection: extractFeaturedIdentifiers('Collection', 'follow'),
      profile: extractFeaturedIdentifiers('Profile', 'follow'),
      resource: extractFeaturedIdentifiers('Resource', 'follow'),
    },
    like: {
      collection: extractFeaturedIdentifiers('Collection', 'like'),
      profile: extractFeaturedIdentifiers('Profile', 'like'),
      resource: extractFeaturedIdentifiers('Resource', 'like'),
    },
  }
  return myFeaturedEntities

  function extractFeaturedIdentifiers(
    extractEntity: Capitalize<KnownEntityType>,
    extractFeature: KnownEntityFeature,
  ): { _key: string }[] {
    const filteredByFeature = (knownFeaturedEntities ?? []).filter(
      ({ feature }) => extractFeature === feature,
    )
    const identifiers =
      extractEntity === 'Collection'
        ? CollectionEntitiesTools.mapToIdentifiersFilterType({
            ids: filteredByFeature,
            type: extractEntity,
          })
        : extractEntity === 'Resource'
        ? EdResourceEntitiesTools.mapToIdentifiersFilterType({
            ids: filteredByFeature,
            type: extractEntity,
          })
        : WebUserEntitiesTools.mapToIdentifiersFilterType({
            ids: filteredByFeature,
            type: extractEntity,
          })
    return identifiers.map(({ entityIdentifier: { _key } }) => ({ _key }))
  }
}
