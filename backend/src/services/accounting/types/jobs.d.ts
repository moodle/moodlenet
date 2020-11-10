import { SendEmailProgress } from '../../email/types'

export type RegisterNewAccountJobReq = { email: string; username: string }
export type RegisterNewAccountProgress = {
  WaitingConfirmEmail: null
  Rejected: { reason: string }
  AccountActivated: null
}

export type VerifyEmailJobReq = { email: string; attemptCount?: number }
export type VerifyEmailJobProgress = {
  Waiting: { attemptCount: number }
  Confirmed: null
  Expired: { attemptCount: number }
  Aborted: { reason: string }
}
