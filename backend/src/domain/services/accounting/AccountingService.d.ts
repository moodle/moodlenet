import { WorkflowEndProgress } from '../../../lib/domain/types'
import { MoodleNetDomain } from '../../MoodleNetDomain'
import { EmailObj } from '../email/EmailService'

export type AccountingService = {
  wf: {
    RegisterNewAccount: {
      ctx: { ctx: string; email: string; username: string }
      start: { email: string; username: string }
      progress: {
        WaitingConfirmEmail: { WaitingConfirmEmail: 'WaitingConfirmEmail' }
        aWaitingConfirmEmail: { aWaitingConfirmEmail: 'aWaitingConfirmEmail' }
      }
      end: {
        AccountActivated: { AccountActivated: 'AccountActivated' }
        Rejected: { reason: string }
      }
      signal: {
        EmailConfirmResult: WorkflowEndProgress<MoodleNetDomain, 'Email', 'SendOne'>
        aEmailConfirmResult: { a: string }
      }
    }
    VerifyAccountEmail: {
      ctx: { email: EmailObj; attemptCount: number; token: string }
      start: { email: EmailObj }
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
