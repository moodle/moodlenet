import { useApis } from '@moodlenet/core'
import kvsPkgRef from '@moodlenet/key-value-store'
import { KeyValueStoreData } from './types.mjs'
export const kvsPkgApis = await useApis(import.meta, kvsPkgRef)
export const kvStore = await kvsPkgApis('getStore')<KeyValueStoreData>()
