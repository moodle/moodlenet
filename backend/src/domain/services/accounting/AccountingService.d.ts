import { Workflow } from '../../../lib/domain/types'
import { MoodleNetDomain } from '../../MoodleNetDomain'

export type AccountingService = {
  api: {}
  ev: {}
  wf: {
    RegisterNewAccount: {
      ctx: {}
      start: { email: string; username: string }
      progress: {
        WaitingConfirmEmail: { in1: string }
        aWaitingConfirmEmail: { in2: number }
      }
      end: {
        NewAccountActivated: void
        Rejected: { reason: 'unconfirmed email' }
      }
      signal: {
        EmailConfirmationResult: Workflow.LifeTypeUnion<
          MoodleNetDomain,
          'Email',
          'VerifyEmail',
          'end'
        >
        aEmailConfirmationResult: { a: number }
      }
    }
  }
}

declare const c: Workflow.LifeTypeUnion<MoodleNetDomain, 'Email', 'VerifyEmail', 'end'>
