import getStore from '@moodlenet/key-value-store/server'
import { shell } from '../shell.mjs'

export type KVSTypes = {
  'persistence-version': { v: number }
  'delete-account-html-message-template': string
}
export const kvStore = await getStore<KVSTypes>(shell)
