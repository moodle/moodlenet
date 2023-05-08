import { RpcStatus } from '@moodlenet/core'
import { webImageResizer } from '@moodlenet/react-app/server'
import type { EntityDocument } from '@moodlenet/system-entities/server'
import assert from 'assert'
import type { WebUserExposeType } from '../common/expose-def.mjs'
import type { ClientSessionDataRpc, Profile, WebUserData } from '../common/types.mjs'
import { publicFiles, publicFilesHttp } from './init.mjs'
import { shell } from './shell.mjs'
import type { WebUserProfileDataType } from './types.mjs'
import { loginAsRoot, sendWebUserTokenCookie, verifyCurrentTokenCtx } from './web-user-auth-lib.mjs'
import {
  editWebUserProfile,
  getProfileAvatarLogicalFilename,
  getProfileImageLogicalFilename,
  getProfileRecord,
  getWebUser,
  searchUsers,
  toggleWebUserIsAdmin,
} from './web-user-lib.mjs'

export const expose = await shell.expose<WebUserExposeType>({
  rpc: {
    'webapp/entity/:feature/:action': {
      guard: () => void 0,
      // async fn({ entityId }, { action, feature }) {
      async fn() {
        return
      },
    },
    'webapp/get-my-featured-entities': {
      guard: () => void 0,
      async fn() {
        return { bookmark: [], follow: [], like: [] }
      },
    },
    'webapp/entity/:feature/count-all': {
      guard: () => void 0,
      async fn() {
        return { count: 10 }
      },
    },
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

        const myProfile = webUserProfileDoc2Profile(profileRecord.entity)
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
        const patchRecord = await editWebUserProfile(_key, editRequest)
        if (!patchRecord) {
          return
        }
        const data = webUserProfileDoc2Profile(patchRecord.entity)

        return {
          data,
          canEdit: !!patchRecord.access.u,
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
        const data: Profile = webUserProfileDoc2Profile(profileRecord.entity)
        return {
          canEdit: !!profileRecord.access.u,
          data,
        }
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
            email: user.contacts.email ?? '', //@ETTO email cannot be undefined, << ?? '' >> should be removed
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
          await editWebUserProfile(_key, {
            avatarImage: null,
          })
          return null
        }

        const resizedRpcFile = await webImageResizer(uploadedRpcFile, 'image')

        const { directAccessId } = await publicFiles.store(avatarLogicalFilename, resizedRpcFile)

        await editWebUserProfile(_key, {
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
          await editWebUserProfile(_key, {
            backgroundImage: null,
          })
          return null
        }

        const resizedRpcFile = await webImageResizer(uploadedRpcFile, 'image')

        const { directAccessId } = await publicFiles.store(imageLogicalFilename, resizedRpcFile)

        await editWebUserProfile(_key, {
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
  },
})
function webUserProfileDoc2Profile(entity: EntityDocument<WebUserProfileDataType>) {
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
