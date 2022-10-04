import _keypair, { keypair as KP } from 'keypair'
import { kvStore } from './use-pkgs.mjs'
// workaround for mistaken export type def in 'keypair' pkg
// CHECK: if I'm missing something, or if gets fixed, or change lib
export const keypair = _keypair as any as typeof KP

// console.log('checkInit')
const { value: exists } = await kvStore.get('keypairs', '')
// console.log('exists :', exists)
if (!exists) {
  console.log('creating new keys for crypto ......')
  const { public: publicKey, private: privateKey } = keypair({ bits: 4096 })
  await kvStore.set('keypairs', '', { privateKey, publicKey })
}
