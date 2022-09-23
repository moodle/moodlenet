import arangoPkgRef from '@moodlenet/arangodb'
import { pkgApis, PkgModuleRef } from '@moodlenet/core'
import { KVStore, ValueObj } from './types.js'
export const COLLECTION_NAME = 'Moodlenet_simple_key_value_store'
export default async function storeFactory({
  consumerModuleRef,
}: {
  consumerModuleRef: PkgModuleRef
}): Promise<KVStore<any>> {
  const arangoSrv = pkgApis(consumerModuleRef, arangoPkgRef)
  const query = arangoSrv('query')({})

  await arangoSrv('ensureCollections')({})({ defs: { [COLLECTION_NAME]: { kind: 'node' } } })
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
    const record = (await query({ q: `RETURN DOCUMENT('${COLLECTION_NAME}/${_key}')` })).resultSet[0]
    return valObj(record)
  }

  async function set(type: string, key: string, value: any): Promise<ValueObj> {
    if (value === void 0) {
      return unset(type, key)
    }
    const _key = fullKeyOf(type, key)
    const strval = JSON.stringify(value)
    const oldRec = (
      await query({
        q: `let key = "${_key}"
            let doc = { _key: key, value:${strval} }
            UPSERT { _key: key }
              INSERT doc
              UPDATE doc
              IN ${COLLECTION_NAME} 
            RETURN OLD`,
      })
    ).resultSet[0]

    return valObj(oldRec)
  }

  async function unset(type: string, key: string): Promise<ValueObj> {
    const _key = fullKeyOf(type, key)
    const oldDoc = (
      await query({
        q: `REMOVE ${COLLECTION_NAME}/${_key}
              FROM ${COLLECTION_NAME} 
            RETURN OLD`,
      })
    ).resultSet[0]

    return valObj(oldDoc)
  }
}

type Record = null | { value?: any }
function valObj(_: Record): ValueObj {
  return { value: _?.value ?? undefined }
}
