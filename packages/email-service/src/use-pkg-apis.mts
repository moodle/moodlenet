import { useApis } from '@moodlenet/core'
import kvsPkgRef from '@moodlenet/key-value-store'
import { MailerCfg } from './types.mjs'

export type KVSTypes = { mailerCfg: MailerCfg }
export const kvsPkgApis = useApis(import.meta, kvsPkgRef)
export const kvStore = await kvsPkgApis('getStore')<KVSTypes>()
