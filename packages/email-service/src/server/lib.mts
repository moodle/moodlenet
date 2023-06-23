import assert from 'assert'
import dot from 'dot'
import { kvStore } from './init/kvStore.mjs'

import { instanceDomain } from '@moodlenet/core'
import { getOrgData } from '@moodlenet/organization/server'
import type { DynEmailLayoutTemplateVars, EmailLayoutTemplateSystemVars } from './types.mjs'
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
  const orgData = await getOrgData()
  const emailLayoutTemplateSystemVars: EmailLayoutTemplateSystemVars = {
    domainUrl: instanceDomain,
    instanceName: orgData.data.instanceName,
  }
  const html = dot.compile(emailTemplateStr)({
    ...mailerCfg.baseEmailLayoutTemplateVars,
    ...emailLayoutTemplateSystemVars,
    ...vars,
  })
  return {
    from: mailerCfg.defaultFrom,
    replyTo: mailerCfg.defaultReplyTo,
    html,
  }
}
