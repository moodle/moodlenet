import { Email_Sent_Event, Send_Now_Api } from './apis/Email.Send_One.Req'

export type Email = {
  Send_One: {
    Send_Now: Send_Now_Api
    Email_Sent: Email_Sent_Event
  }
}
