import { WFLifePayload } from '../../../lib/domain3/types'
import { MoodleNetDomain } from '../../MoodleNetDomain'
import { EmailObj } from '../email/EmailService'

export type AccountingService = {
  wf: {
    RegisterNewAccount: {
      ctx: { ctx: string; email: string; username: string }
      start: { email: string; username: string }
      progress: {
        WaitingConfirmEmail: { email: string; WaitingConfirmEmail: 'WaitingConfirmEmail' }
        aWaitingConfirmEmail: { aWaitingConfirmEmail: 'aWaitingConfirmEmail' }
      }
      end: {
        AccountActivated: { email: string; AccountActivated: 'AccountActivated' }
        Rejected: { email: string; reason: string }
      }
      signal: {
        EmailConfirmResult: WFLifePayload<MoodleNetDomain, 'Email', 'SendOne', 'end'>
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
