import kvStoreFactory from '@moodlenet/key-value-store/server'
import { shell } from '../shell.mjs'
import type { KeyValueStoreData } from '../types.mjs'

export const kvStore = await kvStoreFactory<KeyValueStoreData>(shell)
