import assert from 'assert'
import dot from 'dot'
import { kvStore } from './init/kvStore.mjs'

import type { DynEmailLayoutTemplateVars } from './types.mjs'
export type { SentMessageInfo } from 'nodemailer'

export async function buildEmailTemplate(vars: DynEmailLayoutTemplateVars): Promise<{
  from: string
  replyTo: string
  html: string
}> {
  const mailerCfg = (await kvStore.get('mailerCfg', '')).value
  assert(mailerCfg, 'missing mailerCfg:: record in KeyValueStore')
  const emailTemplateStr = (await kvStore.get('email-layout', '')).value
  assert(emailTemplateStr, 'missing emailTemplateStr:: record in KeyValueStore')
  const html = dot.compile(emailTemplateStr)({
    ...mailerCfg.baseEmailLayoutTemplateVars,
    ...vars,
  })
  return {
    from: mailerCfg.defaultFrom,
    replyTo: mailerCfg.defaultReplyTo,
    html,
  }
}
