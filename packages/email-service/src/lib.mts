import assert from 'assert'
import { createTransport } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'
import { env } from './env.mjs'
import type { EmailObj, NodemailerTransport, SendResp } from './types.mjs'
import kvStore from './kvStore.mjs'
export { SentMessageInfo } from 'nodemailer'

export async function send({ emailObj }: { emailObj: EmailObj }): Promise<SendResp> {
  const mailerCfg = (await kvStore.get('mailerCfg', '')).value
  assert(mailerCfg, 'missing mailerCfg:: record in KeyValueStore')
  const resp = await createTransport(env.nodemailerTransport)
    .sendMail({
      from: mailerCfg.defaultFrom,
      replyTo: mailerCfg.defaultReplyTo,
      ...emailObj,
    })
    .then(messageInfo => {
      logWarnTransportIsJsonTransport(env.nodemailerTransport, emailObj, messageInfo)
      return { success: true, messageInfo } as const
    })
    .catch(err => ({ success: false, error: String(err) } as const))

  return resp
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
  console.log(`@moodlenet/email-service:
  missing configuration
  couldn't really send the following message #${messageInfo.messageId}
  ${JSON.stringify(messageInfo.envelope, null, 4)}
  ${emailObj.text}
  `)
}
