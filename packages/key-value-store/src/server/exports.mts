import { ensureDocumentCollection } from '@moodlenet/arangodb/server'
import type { Shell } from '@moodlenet/core'
import type { KVStore, KVSTypeMap, ValueObj } from './types.js'
export * from './types.js'
export const KV_COLLECTION_NAME = 'Moodlenet_simple_key_value_store'

export default async function kvStoreFactory<TMap extends KVSTypeMap>(
  shell: Shell<any>,
): Promise<KVStore<TMap>> {
  const { collection: KVCollection /* , newlyCreated  */ } = await shell.call(
    ensureDocumentCollection,
  )<DBRecord>(KV_COLLECTION_NAME)

  const kvStore: KVStore<TMap> = {
    set: shell.call(set),
    get: shell.call(get),
    unset: shell.call(unset),
  }

  return kvStore

  function fullKeyOf(type: string, key: string) {
    return `${type}::${key}`
  }
  async function get(type: string, key: string): Promise<ValueObj> {
    const doc = await KVCollection.document(fullKeyOf(type, key), true)
    return valObj(doc)
  }

  async function set(type: string, key: string, value: unknown): Promise<void> {
    if (value === void 0) {
      return unset(type, key)
    }
    await KVCollection.save(
      { _key: fullKeyOf(type, key), value, at: shell.now().toISOString() },

      { overwriteMode: 'update' },
    )
    return
  }

  async function unset(type: string, key: string): Promise<void> {
    await KVCollection.remove(fullKeyOf(type, key), {})
  }
}

type DBRecord = { value: any; at: string }
function valObj(doc: DBRecord | null | undefined): ValueObj {
  if (!doc) {
    return { value: undefined }
  }
  return { value: doc.value, at: doc.at }
}
