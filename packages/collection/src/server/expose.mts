import { CollectionFormValues } from '../common.mjs'
import { mockModel } from './mockLib.mjs'
import { shell } from './shell.mjs'

type KeyId = { key: string }
const { get, _delete, edit, toggleFollow, setIsPublished, toggleBookmark, setImage } = mockModel

export const expose = await shell.expose({
  rpc: {
    'webapp/get/:_key': {
      guard: () => void 0,
      fn: async (_body, params, _query) => await get(params._key, _query),
    },
    'webapp/edit': {
      guard: () => void 0,
      fn: async ({ key, values }: { key: string; values: CollectionFormValues }) =>
        await edit(key, values),
    },
    'webapp/delete': {
      guard: () => void 0,
      fn: async ({ key }: KeyId) => await _delete(key),
    },
    'webapp/toggleFollow': {
      guard: () => void 0,
      fn: async ({ key }: KeyId) => await toggleFollow(key),
    },
    'webapp/setIsPublished': {
      guard: () => void 0,
      fn: async ({ key, publish }: { key: string; publish: boolean }) =>
        await setIsPublished(key, publish),
    },
    'webapp/toggleBookmark': {
      guard: () => void 0,
      fn: async ({ key }: KeyId) => await toggleBookmark(key),
    },
    'webapp/setImage': {
      guard: () => void 0,
      fn: async ({ key, file }: KeyId & { file: File }) => await setImage(key, file),
    },
  },
})
