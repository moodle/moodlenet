import { SentMessageInfo } from 'nodemailer'
import JSONTransport from 'nodemailer/lib/json-transport'
import { Options } from 'nodemailer/lib/mailer'
import SendmailTransport from 'nodemailer/lib/sendmail-transport'
import SESTransport from 'nodemailer/lib/ses-transport'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import StreamTransport from 'nodemailer/lib/stream-transport'

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

export type EmailAddr = string

export type EmailObj = Options
