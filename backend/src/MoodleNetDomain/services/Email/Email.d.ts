import { Api } from '../../../lib/domain/api/types'
import { Event } from '../../../lib/domain/event/types'
import { Flow } from '../../../lib/domain/types/path'
import { EmailObj, VerifyEmailReq } from './types'

export type Email = {
  Send_One: {
    Req: Api<
      { emailObj: EmailObj },
      { success: true; emailId: string } | { error: string; success: false }
    >
    SentEmail: Event<{ success: true; emailId: string } | { error: string; success: false }>
  }
  Verify_Email: {
    Req: Api<VerifyEmailReq, {}>
    Attempt_Send: Api<{}, { success: true } | { error: string; success: false }>
    Confirm_Email: Api<
      { token: string },
      { success: true; flow: Flow } | { error: string; success: false }
    >
    Result: Event<{ email: string } & ({ success: true } | { error: string; success: false })>
  }
}
