import kvStoreFactory from '@moodlenet/key-value-store/server'
import type { LmsWebUserConfig } from '../../common/types.mjs'
import { shell } from '../shell.mjs'

export type KeyValueStoreData = {
  'persistence-version': { v: number }
  'user-configs': LmsWebUserConfig
}

export const kvStore = await kvStoreFactory<KeyValueStoreData>(shell)
