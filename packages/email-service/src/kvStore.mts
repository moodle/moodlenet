import getStore from '@moodlenet/key-value-store'
import shell from './shell.mjs'
import { MailerCfg } from './types.mjs'

export type KVSTypes = { mailerCfg: MailerCfg }

export default await getStore<KVSTypes>(shell)
