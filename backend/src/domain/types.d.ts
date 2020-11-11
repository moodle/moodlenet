import { WorkflowEndPayload } from '../lib/domain/types'

export type MoodleDomain = {
  name: 'MoodleDomain'
  services: {
    Accounting: {
      wf: {
        RegisterNewAccount: {
          context: { ctx: string; email: string; username: string }
          enqueue: { email: string; username: string }
          progress: {
            WaitingConfirmEmail: { WaitingConfirmEmail: 'WaitingConfirmEmail' }
            aWaitingConfirmEmail: { aWaitingConfirmEmail: 'aWaitingConfirmEmail' }
          }
          end: {
            AccountActivated: { AccountActivated: 'AccountActivated' }
            Rejected: { reason: string }
          }
          signal: {
            EmailConfirmResult: WorkflowEndPayload<MoodleDomain, 'Email', 'SendOne'>
            aEmailConfirmResult: { a: string }
          }
        }
        VerifyAccountEmail: {
          context: { email: EmailObj; attemptCount: number; token: string }
          enqueue: { email: EmailObj }
          progress: {
            EmailSent: { EmailSent: 'EmailSent' }
          }
          end: {
            Confirmed: { Confirmed: 'Confirmed' }
            Expired: { Expired: 'Expired' }
            Aborted: { reason: string }
          }
          signal: {
            zz: { a: string }
          }
        }
      }
      ev: {
        XX: { a: number }
        YY: { b: string }
      }
    }
    Email: {
      wf: {
        SendOne: {
          context: { email: EmailObj; attemptCount: number; token: string }
          enqueue: { email: EmailObj }
          progress: {}
          end: {
            Success: { id: string }
            Fail: { reason: string }
          }
          signal: {
            dd: { a: string }
          }
        }
      }
      ev: {}
    }
  }
}
export type EmailObj = {
  to: string
  // from: string
  // subject: string
  // text?: string
  // html?: string
}
