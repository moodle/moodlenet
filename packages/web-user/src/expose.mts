import { createProfile, editProfile, getProfile } from './lib.mjs'
import shell from './shell.mjs'
import { CreateRequest, EditRequest } from './types.mjs'

export const expose = await shell.expose({
  rpc: {
    createProfile: {
      guard: () => void 0,
      fn: (createRequest: CreateRequest) => {
        return createProfile(createRequest)
      },
    },
    editProfile: {
      guard: () => void 0,
      fn: (_editRequest: EditRequest & { key: string }) => {
        const { key, ...editRequest } = _editRequest
        return editProfile(key, editRequest)
      },
    },
    getProfile: {
      guard: () => void 0,
      fn: (key: string) => {
        return getProfile(key)
      },
    },
  },
})
