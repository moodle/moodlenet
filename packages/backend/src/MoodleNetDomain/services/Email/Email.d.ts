import { Event } from '../../../lib/domain/event'
import { Flow } from '../../../lib/domain/flow'
import { Sub } from '../../../lib/domain/sub'
import { Wrk } from '../../../lib/domain/wrk'
import { MoodleNetDomain } from '../../MoodleNetDomain'
import { EmailObj } from './types'

export type SendResult = { success: false; error: string } | { success: true; emailId: string }
export type SendReq = { emailObj: EmailObj; flow: Flow }

export type Email = {
  SendOne: {
    Store: Sub<MoodleNetDomain, 'Email.SendOne.EmailSent'>
    SendNow: Wrk<(_: SendReq) => Promise<SendResult>>
    EmailSent: Event<{ result: SendResult; emailObj: EmailObj }>
  }
}
