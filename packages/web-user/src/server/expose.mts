import { WebUserExposeType } from '../common/expose-def.mjs'
import { WebUserData } from '../common/types.mjs'
import { shell } from './shell.mjs'
import { loginAsRoot } from './web-user-auth-lib.mjs'
import {
  editWebUserProfile,
  getCurrentClientSessionDataRpc,
  getProfileRecord,
  searchUsers,
  toggleWebUserIsAdmin,
} from './web-user-lib.mjs'

export const expose = await shell.expose<WebUserExposeType>({
  rpc: {
    'getCurrentClientSessionDataRpc': {
      guard: () => void 0,
      fn: getCurrentClientSessionDataRpc,
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
        return {
          data: patchRecord.patched,
          canEdit: !!patchRecord.access.u,
        }
      },
    },
    'webapp/profile/get': {
      guard: () => void 0,
      async fn({ _key }) {
        const patchRecord = await getProfileRecord(_key, { projectAccess: ['u'] })
        if (!patchRecord) {
          return
        }
        return { canEdit: !!patchRecord.access.u, data: patchRecord.entity }
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
  },
})
