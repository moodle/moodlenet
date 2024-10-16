import { email_body, named_or_email_address, namedEmailAddressString, ok_ko } from '@moodle/lib-types'
import { renderAsync } from '@react-email/render'
import { createTransport } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { NodemailerSecEnv } from './types'

export type one_or_more_named_or_email_addresses = named_or_email_address[] | named_or_email_address

interface SendEmailConfig {
  env: NodemailerSecEnv
  body: email_body
  subject: string
  sender: named_or_email_address
  inReplyTo?: named_or_email_address | undefined
  to: one_or_more_named_or_email_addresses
  replyTo?: one_or_more_named_or_email_addresses | undefined
  cc?: one_or_more_named_or_email_addresses | undefined
  bcc?: one_or_more_named_or_email_addresses | undefined
  priority?: 'high' | 'normal' | 'low' | undefined
}
interface SentMessageInfo {
  // equals SMTPTransport.SentMessageInfo
  envelope: {
    from: string | false
    to: string[]
  }
  messageId: string
  accepted: named_or_email_address[]
  rejected: named_or_email_address[]
  pending: named_or_email_address[]
  response: string
}
export async function send({
  env,
  body,
  to,
  sender,
  replyTo,
  subject,
  inReplyTo,
  bcc,
  cc,
  priority,
}: SendEmailConfig): Promise<ok_ko<SMTPTransport.SentMessageInfo, { error: unknown }>> {
  const __development_env__send_all_emails_to_prefixed_warn = env.__development_env__send_all_emails_to
    ? `## DEV EMAIL it would have been sent to [${[to].flat().map(namedEmailAddressString).join(' | ')}] ##`
    : ''

  to = env.__development_env__send_all_emails_to ?? to

  const content = body.contentType === 'react' ? { html: await renderAsync(body.element) } : body
  return await createTransport(env.nodemailerTransport)
    .sendMail({
      ...content,
      subject: env.__development_env__send_all_emails_to
        ? `${subject} :: ${__development_env__send_all_emails_to_prefixed_warn}`
        : subject,
      sender,
      to,
      replyTo,
      inReplyTo,
      cc,
      bcc,
      priority,
    })
    .then(sentMessageInfo => {
      logWarnTransportIsJsonTransport(sentMessageInfo)
      return [true, sentMessageInfo] as const
    })
    .catch(e => [false, { reason: 'error', e }] as const)

  function logWarnTransportIsJsonTransport(messageInfo: SMTPTransport.SentMessageInfo) {
    if (
      typeof env.nodemailerTransport !== 'object' ||
      !('jsonTransport' in env.nodemailerTransport) ||
      env.nodemailerTransport.jsonTransport !== true
    ) {
      return
    }
    env.logWarn({
      'missing configuration': `couldn't really send the following message #${messageInfo.messageId}`,
      'envelope': messageInfo.envelope,
      'id': messageInfo.messageId,
      '__development_env__send_all_emails_to': !!env.__development_env__send_all_emails_to,
    })
  }
}
