import kvStoreFactory from '@moodlenet/key-value-store/server'
import { shell } from '../shell.mjs'

export type KeyValueStoreData = {
  'persistence-version': { v: number }
}

export const kvStore = await kvStoreFactory<KeyValueStoreData>(shell)
