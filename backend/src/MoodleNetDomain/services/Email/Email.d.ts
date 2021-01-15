import { EmailSentEvent, SendNowApi } from './apis/Email.SendOne.Req'

export type Email = {
  SendOne: {
    SendNow: SendNowApi
    EmailSent: EmailSentEvent
  }
}
