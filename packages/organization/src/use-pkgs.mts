import { pkgConnection } from '@moodlenet/core'
import kvsPkgRef from '@moodlenet/key-value-store'
import { KeyValueStoreData } from './types.mjs'
export const kvsPkg = await pkgConnection(import.meta, kvsPkgRef)
export const kvStore = await kvsPkg.api('getStore')<KeyValueStoreData>()
