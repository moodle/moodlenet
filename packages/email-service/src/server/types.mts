import type { SentMessageInfo } from 'nodemailer'
import type JSONTransport from 'nodemailer/lib/json-transport'
import type SendmailTransport from 'nodemailer/lib/sendmail-transport'
import type SESTransport from 'nodemailer/lib/ses-transport'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import type StreamTransport from 'nodemailer/lib/stream-transport'

export type NodemailerTransport =
  | string
  | SMTPTransport.Options
  | SendmailTransport.Options
  | StreamTransport.Options
  | JSONTransport.Options
  | SESTransport.Options

export type { SentMessageInfo } from 'nodemailer'

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
  baseEmailLayoutTemplateVars: BaseEmailLayoutTemplateVars
}

export type EmailAddr = string

export type EmailObj = {
  subject: string
  title: string
  to: EmailAddr
  html: string
}

export type EmailLayoutTemplateVars = Record<
  | 'instanceName'
  | 'domainUrl'
  | 'instanceLogoUrl'
  | 'locationUrl'
  | 'location'
  | 'copyright'
  | 'emailTitle'
  | 'receiverEmail'
  | 'emailBody',
  string
>
export type DynEmailLayoutTemplateVars = Pick<
  EmailLayoutTemplateVars,
  'emailTitle' | 'receiverEmail' | 'emailBody'
>
export type BaseEmailLayoutTemplateVars = Pick<
  EmailLayoutTemplateVars,
  'instanceLogoUrl' | 'locationUrl' | 'location' | 'copyright'
>
export type EmailLayoutTemplateSystemVars = Omit<
  EmailLayoutTemplateVars,
  keyof DynEmailLayoutTemplateVars | keyof BaseEmailLayoutTemplateVars
>
