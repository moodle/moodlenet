import kvStoreFactory from '@moodlenet/key-value-store/server'
import type { ReadFlowStatus } from '../ctrl/types.mjs'
import { shell } from '../shell.mjs'

export type FlowStatusType = FlowStatus['type']
export type SentEmails = Record<'first' | 'last', boolean>
export type FlowStatus = {
  type: ReadFlowStatus['type']
  sentEmails: SentEmails
}
export type KeyValueStoreData = {
  'persistence-version': { v: number }
  'flow-status': FlowStatus
}

export const kvStore = await kvStoreFactory<KeyValueStoreData>(shell)
