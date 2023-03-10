import { npm } from '@moodlenet/core'
import { WebUserData } from '../common/types.mjs'
import { getAppearance, setAppearance } from './lib.mjs'
import { shell } from './shell.mjs'
import { WebUserProfile } from './types.mjs'
import { loginAsRoot } from './web-user-auth-lib.mjs'
import {
  editWebUserProfile,
  getCurrentClientSessionDataRpc,
  getProfile,
  searchUsers,
  toggleWebUserIsAdmin,
} from './web-user-lib.mjs'

export const expose = await shell.expose({
  rpc: {
    'getAppearance': {
      guard: () => void 0,
      fn: getAppearance,
    },
    'setAppearance': {
      guard: () => void 0,
      fn: setAppearance,
    },
    'updateAllPkgs': {
      guard: () => void 0,
      fn: () => npm.updateAll(),
    },
    'getCurrentClientSessionDataRpc': {
      guard: () => void 0,
      fn: getCurrentClientSessionDataRpc,
    },
    'loginAsRoot': {
      guard: () => void 0,
      fn: ({ rootPassword }: { rootPassword: string }) => loginAsRoot(rootPassword),
    },
    'webapp/profile/edit': {
      guard: () => void 0,
      fn: async (profileFormValues: WebUserProfile): Promise<WebUserProfile | undefined> => {
        const { _key, ...editRequest } = profileFormValues
        const profileDoc = await editWebUserProfile({ _key }, editRequest)
        const profile = profileDoc && webUserProfileDoc2WebUserProfile(profileDoc)
        return profile
      },
    },
    'webapp/profile/get': {
      guard: () => void 0,
      fn: async (body: { _key: string }): Promise<WebUserProfile | undefined> => {
        const profileDoc = await getProfile({ _key: body._key })
        const profile = profileDoc && webUserProfileDoc2WebUserProfile(profileDoc)
        return profile
      },
    },
    'webapp/roles/searchUsers': {
      guard: () => void 0,
      fn: async ({ search }: { search: string }): Promise<WebUserData[]> => {
        const users = await searchUsers(search)
        const webUsers = users.map<WebUserData>(user => {
          return {
            _key: user._key,
            isAdmin: user.isAdmin,
            name: user.displayName,
            email: user.contacts.email,
          }
        })
        return webUsers
      },
    },
    'webapp/roles/toggleIsAdmin': {
      guard: () => void 0,
      fn: async (by: { profileKey: string } | { userKey: string }) => {
        const patchedUser = await toggleWebUserIsAdmin(by)
        return !!patchedUser
      },
    },
  },
})

function webUserProfileDoc2WebUserProfile(profileDoc: WebUserProfile): WebUserProfile {
  const webUserProfile: WebUserProfile = {
    _key: profileDoc._key,
    aboutMe: profileDoc.aboutMe,
    displayName: profileDoc.displayName,
    location: profileDoc.location,
    organizationName: profileDoc.organizationName,
    siteUrl: profileDoc.siteUrl,
  }
  return webUserProfile
}
