import { SentMessageInfo } from 'nodemailer'
import JSONTransport from 'nodemailer/lib/json-transport'
import { Options } from 'nodemailer/lib/mailer'
import SendmailTransport from 'nodemailer/lib/sendmail-transport'
import SESTransport from 'nodemailer/lib/ses-transport'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import StreamTransport from 'nodemailer/lib/stream-transport'
<<<<<<< HEAD:packages/email-service/src/emailSender/nodemailer/nodemailer.mts
import { EmailObj } from '../../types.mjs'
=======

export { SendMailOptions, SentMessageInfo, TestAccount, Transport, Transporter, TransportOptions } from 'nodemailer'
export {
  Address,
  AmpAttachment,
  Attachment,
  AttachmentLike,
  Connection,
  Envelope,
  Headers,
  IcalAttachment,
  ListHeader,
  ListHeaders,
  Options,
  PluginFunction,
  TextEncoding,
} from 'nodemailer/lib/mailer'
>>>>>>> review_fw:packages/email-service/src/types.mts

export type SendResp =
  | {
      readonly success: true
      readonly messageInfo: SentMessageInfo
    }
  | {
      readonly success: false
      readonly error: string
    }

export type MailerCfg = {
  defaultFrom?: string
  transport:
    | string
    | SMTPTransport.Options
    | SendmailTransport.Options
    | StreamTransport.Options
    | JSONTransport.Options
    | SESTransport.Options
}

<<<<<<< HEAD:packages/email-service/src/emailSender/nodemailer/nodemailer.mts
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
=======
export type EmailAddr = string

export type EmailObj = Options
>>>>>>> review_fw:packages/email-service/src/types.mts
