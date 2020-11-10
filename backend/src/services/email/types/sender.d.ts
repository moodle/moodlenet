import { AnyProgressOf } from '../../../lib/queue'
import { SendEmailJobReq, SendEmailProgress } from './job'

export interface EmailSenderImpl {
  sendEmail: (_: SendEmailJobReq) => Promise<AnyProgressOf<SendEmailProgress>>
}
