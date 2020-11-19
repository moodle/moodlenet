import { WFLifePayload } from '../../../lib/domain/types'
import { MoodleNetDomain } from '../../MoodleNetDomain'
import { EmailObj } from '../email/EmailService'

export type AccountingService = {
  wf: {
    RegisterNewAccount: {
      ctx: { ctx: string; email: string; username: string }
      start: { email: string; username: string }
      progress: {
        WaitingConfirmEmail: { email: string }
        xWaitingConfirmEmail: { xxx: string }
      }
      end: {
        AccountActivated: { AccountActivated: string }
        Rejected: { reason: string }
      }
      signal: {
        EmailConfirmResult: WFLifePayload<
          MoodleNetDomain,
          'Accounting',
          'VerifyAccountEmail',
          'end'
        >
      }
    }
    VerifyAccountEmail: {
      ctx: { email: string /* EmailObj */; attemptCount: number; token: string }
      start: { email: string /* EmailObj */ }
      progress: {
        EmailSent: { EmailSent: 'EmailSent' }
      }
      end: {
        Confirmed: { email: string }
        Expired: { x: string }
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
