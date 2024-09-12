import type { EmailContentProps } from '@moodlenet/component-library/email-templates'
import type { SentMessageInfo } from 'nodemailer'
import type JSONTransport from 'nodemailer/lib/json-transport'
import type SendmailTransport from 'nodemailer/lib/sendmail-transport'
import type SESTransport from 'nodemailer/lib/ses-transport'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import type StreamTransport from 'nodemailer/lib/stream-transport'
import type React from 'react'

export interface Env {
  nodemailerTransport: NodemailerTransport
  __development_env__send_all_emails_to?: string
}

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
}

export type EmailAddr = string
export type EmailActionBtnProps = {
  title: string
  url: string
  buttonStyle?: React.CSSProperties
}

export type EmailObj = EmailContentProps

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
