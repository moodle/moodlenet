import { getCurrentClientSession } from '@moodlenet/authentication-manager/server'
import { npm } from '@moodlenet/core'
import { getAppearance, setAppearance } from './lib.mjs'
import { shell } from './shell.mjs'
import { WebUserData, WebUserProfile } from './types.mjs'
import {
  editWebUserProfile,
  getProfile,
  getWebUser,
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
    'webapp/profile/edit': {
      guard: () => void 0,
      fn: async (profileFormValues: WebUserProfile): Promise<WebUserProfile | null> => {
        const { _key, ...editRequest } = profileFormValues
        const profileDoc = await editWebUserProfile({ _key }, editRequest)
        const profile = profileDoc && webUserProfileDoc2WebUserProfile(profileDoc)
        return profile
      },
    },
    'webapp/profile/get': {
      guard: () => void 0,
      fn: async (body: { _key: string }): Promise<WebUserProfile | null> => {
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
    'webapp/getMyProfile': {
      guard: () => void 0,
      async fn(): Promise<null | { profile: WebUserProfile; isAdmin: boolean }> {
        const clientSession = await getCurrentClientSession()
        if (!clientSession?.user) {
          return null
        }
        const user = await getWebUser({ userKey: clientSession.user._key })
        if (!user) {
          return null
        }
        const profileDoc = await getProfile({ _key: user.profileKey })
        if (!profileDoc) {
          return null
        }

        const profile = webUserProfileDoc2WebUserProfile(profileDoc)

        return { profile, isAdmin: user.isAdmin }
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
