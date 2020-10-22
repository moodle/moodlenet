import { Domain } from '../types'

export type EmailId = any

export type EmailEvents = {}

export type SendEmailReq = {
  to: string[]
  subject: string
  text: string
  html: string
}

export type SendEmailOutcome = EmailSentResult | SendEmailError
export type EmailSentResult = {
  id: EmailId
}
export type SendEmailError = {
  error: string
}

export type EmailApis = {
  sendEmail(req: SendEmailReq): SendEmailOutcome
}

export type EmailDomain = Domain<'Email', EmailEvents, EmailApis>
