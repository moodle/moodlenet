import { Topic, KeyedTopic as KeyedTopic } from '../../../lib/domain/types'
import { EmailObj, VerifyEmailReq } from './types'

export type Email = {
  Send_One: {
    Req: Topic<
      { emailObj: EmailObj },
      { success: true; id: string } | { error: string; success: false }
    >
  }
  Verify_Email: {
    Req: Topic<VerifyEmailReq, { id: string }>
    Attempt_Send: Topic<{ documentKey: string; first: boolean }>
    Result: KeyedTopic<
      { email: string; success: true } | { email: string; error: string; success: false }
    >
  }
}
