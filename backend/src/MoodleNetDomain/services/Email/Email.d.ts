import { Api } from '../../../lib/domain/api/types'
import { Event } from '../../../lib/domain/event/types'
import { EmailObj, VerifyEmailReq } from './types'

export type Email = {
  Send_One: {
    Req: Api<{ emailObj: EmailObj }, {}>
    SentEmail: Event<{ success: true; id: string } | { error: string; success: false }>
  }
  Verify_Email: {
    Req: Api<VerifyEmailReq, {}>
    Attempt_Send: Api<{ first: boolean }, { success: true } | { error: string; success: false }>
    Result: Event<{ email: string } & ({ success: true } | { error: string; success: false })>
  }
}
