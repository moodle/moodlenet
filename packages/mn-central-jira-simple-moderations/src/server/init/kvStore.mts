import kvStoreFactory from '@moodlenet/key-value-store/server'
import { shell } from '../shell.mjs'
import type { ServiceConfigs, UserApprovalRequest } from '../types.mjs'

export type KeyValueStoreData = {
  'persistence-version': { v: number }
  'user-approval-request': UserApprovalRequest
  'service-configs': ServiceConfigs
}

export const kvStore = await kvStoreFactory<KeyValueStoreData>(shell)
