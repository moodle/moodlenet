import { EmailObj } from '../../types'

export interface EmailSender {
  sendEmail: (_: EmailObj) => Promise<{ success: true; emailId: string } | { success: false; error: string }>
}
