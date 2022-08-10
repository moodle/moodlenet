import { createTransport, SentMessageInfo } from 'nodemailer'
import JSONTransport from 'nodemailer/lib/json-transport'
import SendmailTransport from 'nodemailer/lib/sendmail-transport'
import SESTransport from 'nodemailer/lib/ses-transport'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import StreamTransport from 'nodemailer/lib/stream-transport'
import { EmailObj } from '../../types'
// import { EmailSender } from '../types's

export type SendResp =
  | {
      readonly success: true
      readonly messageInfo: SentMessageInfo
    }
  | {
      readonly success: false
      readonly error: string
    }

// questo  è un factory , e
// type Config = { smtp: string }
export type MailerCfg =
  | string
  | SMTPTransport.Options
  | SendmailTransport.Options
  | StreamTransport.Options
  | JSONTransport.Options
  | SESTransport.Options

// export type SendOpts = {}
export function send(emailObj: EmailObj, mailerCfg: MailerCfg /* , opts?: SendOpts */): Promise<SendResp> {
  return createTransport(mailerCfg)
    .sendMail(emailObj)
    .then(messageInfo => ({ success: true, messageInfo } as const))
    .catch(err => ({ success: false, error: String(err) } as const))
}
