import { Api } from '../../../lib/domain/api/types'
import { Event } from '../../../lib/domain/event/types'
import { SendResult } from './persistence/types'
import { EmailObj } from './types'

export type Email = {
  Send_One: {
    Send_Now: Api<{ emailObj: EmailObj }, SendResult>
    Email_Sent: Event<SendResult>
  }
}
