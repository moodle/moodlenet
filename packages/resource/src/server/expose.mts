import { ResourceFormValues } from '../common.mjs'
import {
  deleteResource,
  editResource,
  getResource,
  setContent,
  setImage,
  setIsPublished,
  toggleBookmark,
  toggleLike,
  uploadResource,
} from './mockLib.mjs'
import shell from './shell.mjs'

// const makeRpc = <DefItem extends RpcDefItem>(fn: RpcFnOf<DefItem>): DefItem =>
//   ({  guard: () => void 0,   fn, } as unknown as DefItem)

export type KeyId = { key: string }
export type KeyFile = { key: string; file: File }
export type KeyFileStr = { key: string; file: File | string }
export type KeyResource = { key: string; resource: ResourceFormValues }

export const expose = await shell.expose({
  rpc: {
    'webapp/upload': {
      guard: () => void 0,
      fn: async ({ key }: KeyId) => await uploadResource(key),
    },
    'webapp/get': {
      guard: () => void 0,
      fn: async ({ key }: KeyId) => await getResource(key),
    },
    'webapp/edit': {
      guard: () => void 0,
      fn: async ({ key, resource }: KeyResource) => await editResource(key, resource),
    },
    'webapp/delete': {
      guard: () => void 0,
      fn: async ({ key }: KeyId) => await deleteResource(key),
    },
    'webapp/setImage': {
      guard: () => void 0,
      fn: async ({ key, file }: KeyFile) => await setImage(key, file),
    },
    'webapp/setContent': {
      guard: () => void 0,
      fn: async ({ key, file }: KeyFileStr) => await setContent(key, file),
    },
    'webapp/toggleBookmark': {
      guard: () => void 0,
      fn: async ({ key }: KeyId) => await toggleBookmark(key),
    },
    'webapp/toggleLike': {
      guard: () => void 0,
      fn: async ({ key }: KeyId) => await toggleLike(key),
    },
    'webapp/setIsPublished': {
      guard: () => void 0,
      fn: async ({ key }: KeyId) => await setIsPublished(key),
    },
  },
})
