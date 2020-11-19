import { WFLifePayload } from '../../../lib/domain/types'
import { MoodleNetDomain } from '../../MoodleNetDomain'
import { EmailObj } from '../email/EmailService'

export type AccountingService = {
  wf: {
    RegisterNewAccount: {
      ctx: {}
      start: { email: string; username: string }
      progress: {
        WaitingConfirmEmail: {}
      }
      end: {
        NewAccountActivated: {}
        Rejected: { reason: 'unconfirmed email' }
      }
      signal: {
        EmailConfirmationResult: WFLifePayload<MoodleNetDomain, 'Email', 'VerifyEmail', 'end'>
      }
    }
  }
  ev: {}
}
