import { ResourceFormValues, rpcUrl } from '../common.mjs'
import { edit, get, setContent, setImage, setIsPublished, _delete } from './mockLib.mjs'
import shell from './shell.mjs'

export type KeyId = { key: string }
export type KeyFile = { key: string; file: File }
export type KeyFileStr = { key: string; file: File | string }
export type KeyResource = { key: string; resource: ResourceFormValues }

// good for export in file name controller if code grow
const rpcCtrl = {
  edit: async ({ key, resource }: KeyResource) => await edit(key, resource),
  get: async ({ key }: KeyId) => await get(key),
  delete: async ({ key }: KeyId) => await _delete(key),
  setImage: async ({ key, file }: KeyFile) => await setImage(key, file),
  setContent: async ({ key, file }: KeyFileStr) => await setContent(key, file),
  setIsPublished: async ({ key }: KeyId) => await setIsPublished(key),
  // toggleBookmark: async ({ key }: KeyId) => await toggleBookmark(key), // toggleLike: async ({ key }: KeyId) => await toggleLike(key),
}
const guards = { noCheck: () => void 0 }
const { noCheck } = guards
export const expose = await shell.expose({
  rpc: {
    [rpcUrl.edit]: { guard: noCheck, fn: rpcCtrl.edit },
    [rpcUrl.get]: { guard: noCheck, fn: rpcCtrl.get },
    [rpcUrl.delete]: { guard: noCheck, fn: rpcCtrl.delete },
    [rpcUrl.setImage]: { guard: noCheck, fn: rpcCtrl.setImage },
    [rpcUrl.setContent]: { guard: noCheck, fn: rpcCtrl.setContent },
    [rpcUrl.setIsPublished]: { guard: noCheck, fn: rpcCtrl.setIsPublished },
    // [rpcUrl.toggleBookmark]: { guard, fn: rpcLib.toggleBookmark },  // [rpcUrl.toggleLike]: { guard, fn: rpcLib.toggleLike },
  },
})
