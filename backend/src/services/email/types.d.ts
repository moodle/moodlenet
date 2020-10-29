import { Service } from '../../moleculer'

export type EmailService = Service<
  'email',
  {
    checkverifyEmail: [CheckVerifyEmailReq, CheckVerifyEmailResult]
  }
>
export type CheckVerifyEmailReq = {
  email: string
  token: string
}

export type CheckVerifyEmailResult = boolean

/**
 * Sender Impl
 */
export interface EmailSenderImpl {
  sendEmail: (_: SendEmailObj) => Promise<SendEmailResult>
}

/**
 * Persistence Impl
 */

export type RecordId = string
export interface EmailPersistenceImpl {
  storeSentEmail: (_: StoreSentEmailData) => Promise<RecordId>
  storeSentVerifyEmail: (_: StoreSentVerifyEmailData) => Promise<RecordId>
  checkVerifyEmail: (_: { email: string; token: string }) => Promise<boolean>
  deleteVerifyingEmail: (_: { email: string; token: string }) => Promise<boolean>
}
export type StoreSentEmailData = { jobId?: string; res: SendEmailResult }

export type StoreSentVerifyEmailData = {
  jobId?: string
  token: string
  email: string
  expireDate: Date
  verifiedAt: null | Date
}

/**
 * SendEmailJob
 */

export type SendEmailObj = {
  to: string[]
  from: string
  subject: string
  text?: string
  html?: string
}

export type SendEmailResultOK = {
  id: string
}
export type SendEmailResultKO = {
  error: string
}
export type SendEmailResult = SendEmailResultKO | SendEmailResultOK

/**
 * VerifyEmailJob
 */
export type VerifyEmailReq = {
  mailObj: Omit<SendEmailObj, 'to'> & {
    to: string
  }
  expirationTime: number
}

export type VerifyEmailResult = {
  verifyToken: string
}

/**
 * VerifyTimeoutEmailJob
 */
export type VerifyTimeoutEmailReq = {
  email: string
  token: string
}

export type VerifyTimeoutEmailResult = unknown
