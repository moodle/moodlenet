import { MoodleNet } from '../../..'
import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { Event } from '../../../../lib/domain/event/types'
import { Flow } from '../../../../lib/domain/types/path'
import { getEmailPersistence, getSender } from '../Email.env'
import { EmailObj } from '../types'

export type SendResult =
  | { success: false; error: string }
  | { success: true; emailId: string }

export type StoreSentEmailPersistence = (_: {
  email: EmailObj
  flow: Flow
  result: SendResult
}) => Promise<unknown>

export type SendNowApi = Api<{ emailObj: EmailObj }, SendResult>
export type EmailSentEvent = Event<SendResult>

export const SendOneNow = () =>
  Promise.all([getEmailPersistence(), getSender()]).then(
    ([{ storeSentEmail }, { sendEmail }]) => {
      const handler: RespondApiHandler<SendNowApi> = async ({ flow, req }) => {
        const response = await sendEmail(req.emailObj)
        await storeSentEmail({
          email: req.emailObj,
          flow,
          result: response,
        })
        MoodleNet.emitEvent({
          event: 'Email.SendOne.EmailSent',
          flow,
          payload: response,
        })
        return response
      }
      return handler
    }
  )
