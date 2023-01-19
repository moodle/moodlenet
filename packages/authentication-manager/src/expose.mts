import { getRootSessionToken, getClientSession } from './lib.mjs'
import shell from './shell.mjs'

export type UserTypeApiProps = {
  userId: string
  displayName: string
  email: string
  userTypes: string[]
}

const fakeUsersData: UserTypeApiProps[] = [
  { userId: 'aaaa', displayName: 'aaaa', email: 'aaa@aa.com', userTypes: ['a', 'b'] },
  { userId: 'bbbb', displayName: 'bbbb', email: 'bbbb@aa.com', userTypes: ['a', 'c'] },
]

export const expose = await shell.expose({
  rpc: {
    getClientSession: {
      guard: () => void 0,
      fn: getClientSession,
    },
    getRootSessionToken: {
      guard: () => void 0,
      fn: getRootSessionToken,
    },
    getUsers: {
      guard: () => void 0,
      fn: async (req: { search: string }): Promise<UserTypeApiProps[]> => {
        return new Promise((resolve, reject) => {
          const usersFilt = fakeUsersData.filter(user => user.displayName.indexOf(req.search) > -1)
          resolve(usersFilt)
        })
      },
    },
    changeUserType: {
      guard: () => void 0,
      fn: async (req: { key: string; userType: string }) => {
        const aUser = fakeUsersData.find(user => user.userId === req.key)
        if (!aUser) return
        const idx = aUser?.userTypes.findIndex(utype => utype === req.userType)
        idx < 0 ? aUser?.userTypes.push(req.userType) : aUser?.userTypes.splice(idx, 1)
        return { success: true }
      },
    },
  },
})
