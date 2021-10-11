import { createTransport } from 'nodemailer'
import { SockOf } from '../../../lib/plug'
import { sendEmailAdapter } from '../../../ports/user-auth/adapters'
// import { EmailSender } from '../types'

type Config = { smtp: string }
export const getNodemailerSendEmailAdapter = ({ smtp }: Config): SockOf<typeof sendEmailAdapter> => {
  const emailSender = createTransport(smtp)

  return emailObj =>
    emailSender
      .sendMail(emailObj)
      .then(resp => ({ success: true, emailId: resp.messageId } as const))
      .catch(err => ({ success: false, error: String(err) } as const))
}
