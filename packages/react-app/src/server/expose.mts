import { getApiCtxClientSession } from '@moodlenet/authentication-manager'
import { npm } from '@moodlenet/core'
import { getAppearance, setAppearance } from './lib.mjs'
import shell from './shell.mjs'
import { ProfileFormValues, WebUserData } from './types.mjs'
import {
  editProfile,
  getProfile,
  getProfileUser,
  patchProfileUser,
  searchUsers,
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
      fn: (profileFormValues: ProfileFormValues & { key: string }) => {
        const { key, ...editRequest } = profileFormValues
        return editProfile(key, editRequest)
      },
    },
    'webapp/profile/get': {
      guard: () => void 0,
      fn: (body: { key: string }) => {
        return getProfile(body.key)
      },
    },
    'webapp/roles/searchUsers': {
      guard: () => void 0,
      fn: async ({ search }: { search: string }): Promise<WebUserData[]> => {
        const users = await searchUsers(search)
        const x = users.map<WebUserData>(user => {
          return {
            _key: user._key,
            isAdmin: user.isAdmin,
            name: user.name,
            email: user.contacts.email,
          }
        })
        return x
      },
    },
    'webapp/roles/toggleIsAdmin': {
      guard: () => void 0,
      fn: async ({ _key }: { _key: string }) => {
        const profileUser = await getProfileUser(_key)
        if (!profileUser) {
          return false
        }
        await patchProfileUser({ user: _key }, { isAdmin: !profileUser.isAdmin })
        return true
      },
    },
    'webapp/getMyProfile': {
      guard: () => void 0,
      async fn() {
        const clientSession = await getApiCtxClientSession()
        if (!clientSession?.user) {
          return null
        }
        const user = await getProfileUser(clientSession.user.id)
        if (!user) {
          return null
        }
        const profile = await getProfile(user.profileKey)
        if (!profile) {
          return null
        }
        return { profile, isAdmin: user.isAdmin }
      },
    },
  },
})
