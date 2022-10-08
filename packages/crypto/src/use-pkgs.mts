import { useApis } from '@moodlenet/core'
import kvsConnection from '@moodlenet/key-value-store'
import { KVStoreTypes } from './types.mjs'

const kvStoreApis = await useApis(import.meta, kvsConnection)
export const kvStore = await kvStoreApis('getStore')<KVStoreTypes>()
