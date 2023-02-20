import { DocumentMetadata, ensureDocumentCollection } from '@moodlenet/arangodb/server'
import type { Shell } from '@moodlenet/core'
import { KVStore, KVSTypeMap, ValueObj } from './types.js'
export * from './types.js'
export const KV_COLLECTION_NAME = 'Moodlenet_simple_key_value_store'

export default async function kvStoreFactory<TMap extends KVSTypeMap>(
  shell: Shell,
): Promise<KVStore<TMap>> {
  return shell.initiateCall(async () => {
    const { collection: KVCollection /* , newlyCreated  */ } = await shell.call(
      ensureDocumentCollection,
    )(KV_COLLECTION_NAME)

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
        { _key: fullKeyOf(type, key), value },

        { overwriteMode: 'update' },
      )
      return
    }

    async function unset(type: string, key: string): Promise<void> {
      await KVCollection.remove(fullKeyOf(type, key), {})
    }
  })
}

type DBRecord = { value?: any } & DocumentMetadata
function valObj(_: DBRecord | null | undefined): ValueObj {
  return { value: _ ? _.value : undefined }
}
