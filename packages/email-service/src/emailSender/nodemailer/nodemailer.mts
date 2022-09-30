import { createTransport } from 'nodemailer'
import { EmailObj, MailerCfg, SendResp } from '../../types.mjs'

// export type SendOpts = {}
export function sendEmail(
  transportCfg: MailerCfg['transport'],
  emailObj: EmailObj /* , opts?: SendOpts */,
): Promise<SendResp> {
  return createTransport(transportCfg)
    .sendMail(emailObj)
    .then(messageInfo => ({ success: true, messageInfo } as const))
    .catch(err => ({ success: false, error: String(err) } as const))
}
