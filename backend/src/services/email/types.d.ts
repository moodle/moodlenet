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
  sendEmail: (_: SendEmailObj) => Promise<SendEmailProgressOK | SendEmailProgressKO>
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
export type StoreSentEmailData = { jobId?: string; res: SendEmailProgress }

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

export type SendEmailProgressOK = {
  type: 'SendEmailProgressOK'
  id: string
}
export type SendEmailProgressKO = {
  type: 'SendEmailProgressKO'
  error: string
}
export type SendEmailProgress = SendEmailProgressKO | SendEmailProgressOK

/**
 * VerifyEmailJob
 */
export type VerifyEmailReq = {
  mailObj: Omit<SendEmailObj, 'to'> & {
    to: string
  }
  expirationTime: number
}

export type VerifyEmailProgressStarted = {
  type: 'VerifyEmailProgressStarted'
  email: string
  token: string
}
export type VerifyEmailProgressTokenExpired = {
  type: 'VerifyEmailProgressTokenExpired'
  email: string
  tokenExpired: true
}
export type VerifyEmailProgressVerified = {
  type: 'VerifyEmailProgressVerified'
  email: string
  verified: true
}
export type VerifyEmailProgress =
  | VerifyEmailProgressStarted
  | VerifyEmailProgressTokenExpired
  | VerifyEmailProgressVerified
