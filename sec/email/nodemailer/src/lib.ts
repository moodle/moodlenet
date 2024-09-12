import { createTransport } from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'

import assert from 'assert'
import type { EmailObj, SendResp } from './types.js'
export type { SentMessageInfo } from 'nodemailer'

export async function send(emailObj: EmailObj): Promise<SendResp> {
  const __development_env__send_all_emails_to_prefixed_warn =
    env.__development_env__send_all_emails_to
      ? `## DEV EMAIL it would have been sent to <${emailObj.receiverEmail}> ## `
      : ''
  const emailContentProps: EmailContentProps = {
    ...emailObj,
    receiverEmail: env.__development_env__send_all_emails_to ?? emailObj.receiverEmail,
    subject: `${__development_env__send_all_emails_to_prefixed_warn}${emailObj.subject}`,
  }
  const html = await renderEmailTemplate({ content: emailContentProps })
  return createTransport(env.nodemailerTransport)
    .sendMail({
      from: mailerCfg.defaultFrom,
      replyTo: mailerCfg.defaultReplyTo,
      to: emailContentProps.receiverEmail,
      subject: emailContentProps.subject,
      html,
    })
    .then(messageInfo => {
      logWarnTransportIsJsonTransport(messageInfo)
      return { success: true, messageInfo } as const
    })
    .catch(err => ({ success: false, error: String(err) }) as const)

  function logWarnTransportIsJsonTransport(messageInfo: SMTPTransport.SentMessageInfo) {
    if (
      typeof env.nodemailerTransport !== 'object' ||
      !('jsonTransport' in env.nodemailerTransport) ||
      env.nodemailerTransport.jsonTransport !== true
    ) {
      return
    }
    shell.log('warn', {
      'missing configuration': `couldn't really send the following message #${messageInfo.messageId}`,
      emailObj,
      'envelope': messageInfo.envelope,
      'id': messageInfo.messageId,
      '__development_env__send_all_emails_to': !!env.__development_env__send_all_emails_to,
    })
  }
}
