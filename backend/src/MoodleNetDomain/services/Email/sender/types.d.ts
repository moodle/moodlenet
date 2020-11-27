import { EmailObj } from '../types'

export interface EmailSenderImpl {
  sendEmail: (
    _: EmailObj
  ) => Promise<{ success: true; id: string } | { success: false; error: string }>
}
