import { MNArangoDBExt } from '@moodlenet/arangodb'
import { Shell } from '@moodlenet/core'
import { KVStore, ValueObj } from '../types'
export const COLLECTION_NAME = 'Moodlenet_simple_key_value_store'
export default async function storeFactory({ consumerShell }: { consumerShell: Shell }): Promise<KVStore<any>> {
  const arangoSrv = consumerShell.pkg<MNArangoDBExt>('@moodlenet/arangodb@0.1.0')
  const query = arangoSrv.fetch('query')

  await arangoSrv.fetch('ensureDocumentCollections')({ defs: [{ name: COLLECTION_NAME }] })
  const kvStore: KVStore<any> = {
    set,
    get,
    unset,
  }
  return kvStore

  function fullKeyOf(type: string, key: string) {
    return `${type}::${key}`
  }
  async function get(type: string, key: string): Promise<ValueObj> {
    const _key = fullKeyOf(type, key)
    const record = (await query({ q: `RETURN DOCUMENT(${COLLECTION_NAME}/${_key})` })).msg.data.resultSet[0]
    return record?.value ?? undefined
  }

  async function set(type: string, key: string, value: any): Promise<ValueObj> {
    const _key = fullKeyOf(type, key)
    const strval = JSON.stringify(value)
    const oldDoc = (
      await query({
        q: `UPSERT { _key:"${_key}" }
              INSERT ${strval}
              UPDATE ${strval}
              IN ${COLLECTION_NAME} 
            RETURN OLD`,
      })
    ).msg.data.resultSet[0]

    return oldDoc?.value ?? undefined
  }

  async function unset(type: string, key: string): Promise<ValueObj> {
    const _key = fullKeyOf(type, key)
    const oldDoc = (
      await query({
        q: `REMOVE ${COLLECTION_NAME}/${_key} FROM ${COLLECTION_NAME} RETURN OLD`,
      })
    ).msg.data.resultSet[0]

    return oldDoc?.value ?? undefined
  }
}
