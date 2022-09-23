import { connect, pkgApis } from '@moodlenet/core'
import kvStorePkgRef from '@moodlenet/key-value-store'
import _keypair, { keypair as KP } from 'keypair'
import apis from './apis.mjs'
import { KVStoreTypes } from './types.mjs'

// workaround for mistaken export type def in 'keypair' pkg
// CHECK: if I'm missing something, or if gets fixed, or change lib
const keypair = _keypair as any as typeof KP

export const connection = await connect(import.meta, apis)
const kvStoreApis = pkgApis(import.meta, kvStorePkgRef)
export const kvStore = await kvStoreApis('getStore')({})<KVStoreTypes>()

await checkInit()

async function checkInit() {
  // console.log('checkInit')
  const { value: exists } = await kvStore.get('keypairs', '')
  // console.log('exists :', exists)
  if (exists) {
    return
  }
  const { public: publicKey, private: privateKey } = keypair({ bits: 4096 })
  // console.log('storing new keys')
  await kvStore.set('keypairs', '', { privateKey, publicKey })
}
