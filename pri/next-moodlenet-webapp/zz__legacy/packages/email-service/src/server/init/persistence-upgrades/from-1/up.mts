import assert from 'assert'
import { kvStore } from '../../kvStore.mjs'

kvStore.unset('email-layout' as any, '')
const mailerCfg = await kvStore.get('mailerCfg', '')
assert(mailerCfg.value)
await kvStore.set('mailerCfg', '', {
  defaultFrom: mailerCfg.value.defaultFrom,
  defaultReplyTo: mailerCfg.value.defaultReplyTo,
})

export default 2
