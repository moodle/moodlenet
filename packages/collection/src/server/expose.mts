import { mockModel } from './mockLib.mjs'
import { shell } from './shell.mjs'
const { get, _delete, edit, toggleFollow, setIsPublished } = mockModel

export const expose = await shell.expose({
  rpc: {
    'webapp/get/:_key': {
      guard: () => void 0,
      fn: async (_body, params, _query) => {
        // console.log({ _body, params, _query })
        await get(params._key)
      },
    },
    'webapp/edit': {
      guard: () => void 0,
      fn: async ({ key, values }: { key: string; values: unknown }) => await edit(key, values),
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
