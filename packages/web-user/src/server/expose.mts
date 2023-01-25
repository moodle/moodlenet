import { createProfile, editProfile, getProfile, searchUsers } from './lib.mjs'
import shell from './shell.mjs'
import { CreateRequest, EditRequest, UserTypeApiProps } from './types.mjs'

export const expose = await shell.expose({
  rpc: {
    'profile/create': {
      guard: () => void 0,
      fn: (createRequest: CreateRequest) => {
        return createProfile(createRequest)
      },
    },
    'webapp/profile/edit': {
      guard: () => void 0,
      fn: (_editRequest: EditRequest & { key: string }) => {
        const { key, ...editRequest } = _editRequest
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
      fn: async ({ search }: { search: string }): Promise<UserTypeApiProps[]> => {
        const profiles = await searchUsers(search)
        const users = profiles.map<UserTypeApiProps>(({ title, _id }) => ({
          title: title,
          email: 'aa@aaa.aa',
          isAdmin: false,
          userId: _id,
        }))
        return users
      },
    },
    'webapp/roles/toggleIsAdmin': {
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
const fakeUsersData: UserTypeApiProps[] = [
  { userId: 'aaaa', title: 'aaaa', email: 'aaa@aa.com', isAdmin: true },
  { userId: 'bbbb', title: 'bbbb', email: 'bbbb@aa.com', isAdmin: false },
]
