import getStore from '@moodlenet/key-value-store/server'
import { shell } from '../shell.mjs'
import type { MailerCfg } from '../types.mjs'

export type KVSTypes = {
  'persistence-version': { v: number }
  'mailerCfg': MailerCfg
}
export const kvStore = await getStore<KVSTypes>(shell)
