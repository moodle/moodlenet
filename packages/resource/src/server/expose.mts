import { ResourceFormValues, rpcUrl } from '../common.mjs'
import {
  deleteResource,
  editResource,
  getResource,
  setContent,
  setImage,
  setIsPublished,
} from './mockLib.mjs'
import shell from './shell.mjs'

export type KeyId = { key: string }
export type KeyFile = { key: string; file: File }
export type KeyFileStr = { key: string; file: File | string }
export type KeyResource = { key: string; resource: ResourceFormValues }

// good for export in file name controller if code grow
const rpcCtrl = {
  edit: async ({ key, resource }: KeyResource) => await editResource(key, resource),
  get: async ({ key }: KeyId) => await getResource(key),
  delete: async ({ key }: KeyId) => await deleteResource(key),
  setImage: async ({ key, file }: KeyFile) => await setImage(key, file),
  setContent: async ({ key, file }: KeyFileStr) => await setContent(key, file),
  setIsPublished: async ({ key }: KeyId) => await setIsPublished(key),
  // toggleBookmark: async ({ key }: KeyId) => await toggleBookmark(key), // toggleLike: async ({ key }: KeyId) => await toggleLike(key),
}
const guards = {
  noCheck: () => void 0,
}
export const expose = await shell.expose({
  rpc: {
    [rpcUrl.edit]: { guard: guards.noCheck, fn: rpcCtrl.edit },
    [rpcUrl.get]: { guard: guards.noCheck, fn: rpcCtrl.get },
    [rpcUrl.delete]: { guard: guards.noCheck, fn: rpcCtrl.delete },
    [rpcUrl.setImage]: { guard: guards.noCheck, fn: rpcCtrl.setImage },
    [rpcUrl.setContent]: { guard: guards.noCheck, fn: rpcCtrl.setContent },
    [rpcUrl.setIsPublished]: { guard: guards.noCheck, fn: rpcCtrl.setIsPublished },
    // [rpcUrl.toggleBookmark]: { guard, fn: rpcLib.toggleBookmark },  // [rpcUrl.toggleLike]: { guard, fn: rpcLib.toggleLike },
  },
})

// const a = expose.rpc[rpcUrl.edit]
