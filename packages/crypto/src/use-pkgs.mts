import { pkgConnection } from '@moodlenet/core'
import kvsConnection from '@moodlenet/key-value-store'
import { KVStoreTypes } from './types.mjs'

const kvStorePkg = await pkgConnection(import.meta, kvsConnection)
export const kvStore = await kvStorePkg.api('getStore')<KVStoreTypes>()
