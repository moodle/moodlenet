import { named_or_email_address } from '@moodle/lib-types'
import type JSONTransport from 'nodemailer/lib/json-transport'
import type SendmailTransport from 'nodemailer/lib/sendmail-transport'
import type SESTransport from 'nodemailer/lib/ses-transport'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import type StreamTransport from 'nodemailer/lib/stream-transport'

export interface NodemailerSecEnv {
  sender: named_or_email_address
  nodemailerTransport: NodemailerTransport
  __development_env__send_all_emails_to?: named_or_email_address
  logWarn(_: object): unknown
}

export type NodemailerTransport =
  | string
  | SMTPTransport.Options
  | SendmailTransport.Options
  | StreamTransport.Options
  | JSONTransport.Options
  | SESTransport.Options
