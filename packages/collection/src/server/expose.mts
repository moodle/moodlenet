import { mockModel } from './mockLib.mjs'
import { shell } from './shell.mjs'
const { get, _delete, edit, toggleFollow, setIsPublished } = mockModel

export const expose = await shell.expose({
  rpc: {
    'webapp/get': {
      guard: () => void 0,
      fn: async (keyId: string) => await get(keyId),
    },
    'webapp/edit': {
      guard: () => void 0,
      fn: async (key: string, values: unknown) => await edit(key, values),
    },
    'webapp/delete': {
      guard: () => void 0,
      fn: async (keyId: string) => await _delete(keyId),
    },
    'webapp/toggleFollow': {
      guard: () => void 0,
      fn: async (keyId: string) => await toggleFollow(keyId),
    },
    'webapp/setIsPublished': {
      guard: () => void 0,
      fn: async (keyId: string) => await setIsPublished(keyId),
    },
    'webapp/toggleBookmark': {
      guard: () => void 0,
      fn: async (keyId: string) => await setIsPublished(keyId),
    },
  },
})
