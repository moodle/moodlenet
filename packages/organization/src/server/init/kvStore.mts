import kvStoreFactory from '@moodlenet/key-value-store/server'
import type { OrganizationData } from '../../common/types.mjs'
import { shell } from '../shell.mjs'

export type KeyValueStoreData = {
  'persistence-version': { v: number }
  'organizationData': OrganizationData
}

export const kvStore = await kvStoreFactory<KeyValueStoreData>(shell)
