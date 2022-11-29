import { createTransport } from 'nodemailer'
import { env } from './env.mjs'
import type { EmailObj, SendResp } from './types.mjs'
import { kvStore } from './use-pkg-apis.mjs'
export { SentMessageInfo } from 'nodemailer'

export async function send({ emailObj }: { emailObj: EmailObj }): Promise<SendResp> {
  const mailerCfg = env?.mailerCfg ??
    (await kvStore.get('mailerCfg', '')).value ?? {
      defaultFrom: 'n/a',
      defaultReplyTo: 'n/a',
      transport: {
        jsonTransport: true,
      },
    }
  const NO_TRANSPORT =
    typeof mailerCfg.transport === 'object' && 'jsonTransport' in mailerCfg.transport

  const resp = await createTransport(mailerCfg.transport)
    .sendMail({
      from: mailerCfg.defaultFrom,
      replyTo: mailerCfg.defaultReplyTo,
      ...emailObj,
    })
    .then(messageInfo => {
      if (NO_TRANSPORT) {
        console.warn(`@moodlenet/email-service:
missing configuration
couldn't really send the following message #${messageInfo.messageId}
${JSON.stringify(messageInfo.envelope, null, 4)}
${emailObj.text}
`)
      }
      return { success: true, messageInfo } as const
    })
    .catch(err => ({ success: false, error: String(err) } as const))

  return resp
}
