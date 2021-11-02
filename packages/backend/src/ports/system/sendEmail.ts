import { ns } from '../../lib/ns/namespace'
import { plug } from '../../lib/plug'

export const adapter = plug<
  (_: EmailObj) => Promise<{ success: true; emailId: string } | { success: false; error: string }>
>(ns(module, 'adapter'))

export interface EmailSender {
  sendEmail: (_: EmailObj) => Promise<{ success: true; emailId: string } | { success: false; error: string }>
}
export type EmailAddr = string

export type EmailObj = {
  to: EmailAddr
  from: EmailAddr
  subject: string
  text?: string
  html?: string
}
