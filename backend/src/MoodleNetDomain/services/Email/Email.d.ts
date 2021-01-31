import { EmailSentEvent, SendOneNow } from './apis/Email.SendOne.Req'

export type Email = {
  SendOne: {
    SendNow: typeof SendOneNow
    EmailSent: EmailSentEvent
  }
}
