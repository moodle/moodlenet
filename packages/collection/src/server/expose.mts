import { CollectionFormValues } from '../common.mjs'
import { create, edit, get, setImage, setIsPublished, _delete } from './mockLib.mjs'
import { shell } from './shell.mjs'

type KeyId = { key: string }
type KeyValue = { key: string; values: CollectionFormValues }
type KeyFile = { key: string; file: File }
type keyBoolean = { key: string; publish: boolean }
type Result = Parameters<(a: { _key: string } | null, b?: { _key: string }) => CollectionFormValues>

// good for export in file name controller if code grow
const rpcCtrl = {
  // RpcArgs accepts 3 arguments : body(an object), url-params:(Record<string,string> ), and an object(Record<string,string>) describing query-string
  get: async (...args: Result) =>
    await get((args[0]?._key ? args[0]?._key : args[1]?._key) || '-1'),
  edit: async ({ key, values }: KeyValue) => await edit(key, values),
  setIsPublished: async ({ key, publish }: keyBoolean) => await setIsPublished(key, publish),
  setImage: async ({ key, file }: KeyFile) => await setImage(key, file),
  create: async () => await create(),
  _delete: async ({ key }: KeyId) => await _delete(key),
  // toggleFollow: async ({ key }: KeyId) => await toggleFollow(key), // toggleBookmark: async ({ key }: KeyId) => await toggleBookmark(key),
}

const guards = { noCheck: () => void 0 }
const { noCheck } = guards
export const expose = await shell.expose({
  rpc: {
    'webapp/get/:_key': { guard: noCheck, fn: rpcCtrl.get },
    'webapp/edit': { guard: noCheck, fn: rpcCtrl.edit },
    'webapp/delete': { guard: noCheck, fn: rpcCtrl._delete },
    'webapp/setIsPublished': { guard: noCheck, fn: rpcCtrl.setIsPublished },
    'webapp/setImage': { guard: noCheck, fn: rpcCtrl.setImage },
    'webapp/create': { guard: noCheck, fn: rpcCtrl.create },
    //'webapp/toggleBookmark': { guard: noCheck, fn: rpcCtrl.toggleBookmark },// 'webapp/toggleFollow': { guard: noCheck, fn: rpcCtrl.toggleFollow },
  },
})
