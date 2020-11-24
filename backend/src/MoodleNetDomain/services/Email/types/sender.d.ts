import { EmailObj } from '.'

export interface EmailSenderImpl {
  sendEmail: (
    _: EmailObj
  ) => Promise<{ success: true; id: string } | { success: false; error: string }>
}
