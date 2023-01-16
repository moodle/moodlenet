import assert from 'assert'
import kvStore from '../kvStore.mjs'

export async function getKeys() {
  const { value: pair } = await kvStore.get('keypairs', '')
  assert(pair, 'No key-pair found !')
  return pair
}
