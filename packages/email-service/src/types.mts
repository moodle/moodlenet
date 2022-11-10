import { SentMessageInfo } from 'nodemailer'
import JSONTransport from 'nodemailer/lib/json-transport'
import SendmailTransport from 'nodemailer/lib/sendmail-transport'
import SESTransport from 'nodemailer/lib/ses-transport'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import StreamTransport from 'nodemailer/lib/stream-transport'

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
  defaultFrom: EmailAddr
  defaultReplyTo: EmailAddr
  transport:
    | string
    | SMTPTransport.Options
    | SendmailTransport.Options
    | StreamTransport.Options
    | JSONTransport.Options
    | SESTransport.Options
}

export type EmailAddr = string

export type EmailObj = {
  to: string | EmailAddr | Array<string | EmailAddr>
  text: string
}
