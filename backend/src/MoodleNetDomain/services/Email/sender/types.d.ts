import { EmailObj } from '../types'

export interface EmailSender {
  sendEmail: (
    _: EmailObj
  ) => Promise<{ success: true; id: string } | { success: false; error: string }>
}
