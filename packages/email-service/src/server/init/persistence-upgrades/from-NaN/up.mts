import type { EmailAddr, MailerCfg } from '../../../types.mjs'
import { kvStore } from '../../kvStore.mjs'

export type MailerCfgVNaN = {
  defaultFrom: EmailAddr
  defaultReplyTo: EmailAddr
}

const MailerCfgVNaN: MailerCfgVNaN = {
  defaultFrom: 'noreply',
  defaultReplyTo: 'noreply',
}
kvStore.set('mailerCfg', '', MailerCfgVNaN as MailerCfg)

export default -99
