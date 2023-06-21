import { createTransport } from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'
import { env } from './init/env.mjs'
import { shell } from './shell.mjs'

import { buildEmailTemplate } from './lib.mjs'
import type { EmailObj, NodemailerTransport, SendResp } from './types.mjs'
export type { SentMessageInfo } from 'nodemailer'

export async function send({ emailObj }: { emailObj: EmailObj }): Promise<SendResp> {
  const { from, html, replyTo } = await buildEmailTemplate({
    emailBody: emailObj.html,
    emailTitle: emailObj.title,
    receiverEmail: emailObj.to,
  })
  return createTransport(env.nodemailerTransport)
    .sendMail({
      from,
      replyTo,
      to: emailObj.to,
      subject: emailObj.subject,
      html,
    })
    .then(messageInfo => {
      logWarnTransportIsJsonTransport(env.nodemailerTransport, emailObj, messageInfo)
      return { success: true, messageInfo } as const
    })
    .catch(err => ({ success: false, error: String(err) } as const))
}

function logWarnTransportIsJsonTransport(
  transport: NodemailerTransport,
  emailObj: EmailObj,
  messageInfo: SMTPTransport.SentMessageInfo,
) {
  if (
    typeof transport !== 'object' ||
    !('jsonTransport' in transport) ||
    transport.jsonTransport !== true
  ) {
    return
  }
  shell.log('warn', {
    'missing configuration': `couldn't really send the following message #${messageInfo.messageId}`,
    emailObj,
    'envelope': messageInfo.envelope,
    'id': messageInfo.messageId,
  })
}
