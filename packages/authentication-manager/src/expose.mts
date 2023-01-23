import { getRootSessionToken, getClientSession } from './lib.mjs'
import shell from './shell.mjs'

export type UserTypeApiProps = {
  userId: string
  displayName: string
  email: string
  isAdmin: boolean
}

const fakeUsersData: UserTypeApiProps[] = [
  { userId: 'aaaa', displayName: 'aaaa', email: 'aaa@aa.com', isAdmin: true},
  { userId: 'bbbb', displayName: 'bbbb', email: 'bbbb@aa.com', isAdmin: false},
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
        return new Promise(resolve => {
          const usersFilt = fakeUsersData.filter(user => user.displayName.indexOf(req.search) > -1)
          resolve(usersFilt)
        })
      },
    },
    toggleIsAdmin: {
      guard: () => void 0,
      fn: async (req: { userId: string }) => {
        const aUser = fakeUsersData.find(user => user.userId === req.userId)
        if (!aUser) return
        aUser.isAdmin = !aUser.isAdmin
        return { success: true }
      },
    },
  },
})
