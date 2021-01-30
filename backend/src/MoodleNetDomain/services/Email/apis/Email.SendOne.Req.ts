import { MoodleNet } from '../../..'
import { Event } from '../../../../lib/domain/event/types'
import { Flow } from '../../../../lib/domain/types/path'
import { getEmailPersistence, getSender } from '../Email.env'
import { EmailObj } from '../types'

export type SendResult =
  | { success: false; error: string }
  | { success: true; emailId: string }
export type SendReq = { emailObj: EmailObj; flow: Flow }

export type StoreSentEmailPersistence = (_: {
  email: EmailObj
  flow: Flow
  result: SendResult
}) => Promise<unknown>

export type EmailSentEvent = Event<SendResult>
export const SendOneNow = async ({ emailObj, flow }: SendReq) => {
  const [{ storeSentEmail }, { sendEmail }] = await Promise.all([
    getEmailPersistence(),
    getSender(),
  ])

  const response = await sendEmail(emailObj)
  await storeSentEmail({
    email: emailObj,
    flow,
    result: response,
  })
  MoodleNet.event('Email.SendOne.EmailSent').emit({
    flow,
    payload: response,
  })
  return response
}
