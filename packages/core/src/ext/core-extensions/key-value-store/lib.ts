import { Shell, splitExtId, subPVal } from '@moodlenet/kernel'
import type { MoodlenetKeyValueStoreExt, MoodlenetKeyValueStoreLib as Lib } from './types'

export function kvLib<KVMap = {}>(shell: Shell): Lib<KVMap> {
  const { extName: storeName } = splitExtId(shell.extId)

  const kvsImplSubPVal = subPVal<MoodlenetKeyValueStoreExt>(shell)

  const get: Lib<KVMap>['get'] = key => kvsImplSubPVal('moodlenet.key-value-store@0.1.10::get')({ storeName, key })

  const put: Lib<KVMap>['put'] = (key, val) =>
    kvsImplSubPVal('moodlenet.key-value-store@0.1.10::put')({ storeName, key, val })

  const create: Lib<KVMap>['create'] = () => kvsImplSubPVal('moodlenet.key-value-store@0.1.10::create')({ storeName })

  const exists: Lib<KVMap>['exists'] = () => kvsImplSubPVal('moodlenet.key-value-store@0.1.10::exists')({ storeName })

  const lib: Lib<KVMap> = {
    get,
    put,
    create,
    exists,
  }
  return lib
}
