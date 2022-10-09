import { pkgConnection } from '@moodlenet/core'
import kvsPkgRef from '@moodlenet/key-value-store'
import { MailerCfg } from './types.mjs'

export type KVSTypes = { mailerCfg: MailerCfg }
export const kvsPkg = await pkgConnection(import.meta, kvsPkgRef)
export const kvStore = await kvsPkg.api('getStore')<KVSTypes>()
