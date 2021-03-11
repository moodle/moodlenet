import { Flow } from '../../../lib/domain/flow'
import { Wrk } from '../../../lib/domain/wrk'
import { EmailObj } from './types'

export type SendResult = { success: false; error: string } | { success: true; emailId: string }
export type SendReq = { emailObj: EmailObj; flow: Flow }

export type Email = {
  SendOne: Wrk<(_: SendReq) => Promise<SendResult>>
}
