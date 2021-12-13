import { createTransport } from 'nodemailer'
import { SockOf } from '../../../lib/plug'
import { adapter } from '../../../ports/system/sendEmail'
// import { EmailSender } from '../types'

type Config = { smtp: string }
export const getNodemailerSendEmailAdapter = ({ smtp }: Config): SockOf<typeof adapter> => {
  const emailSender = createTransport(smtp)
  return emailObj =>
    emailSender
      .sendMail(emailObj)
      .then(resp => ({ success: true, emailId: resp.messageId } as const))
      //.catch(err => ({ success: false, error: String(err) } as const))
      .catch(err => {
        console.error(`NodeMailer failed to send email`, emailObj, err)
        return { success: false, error: String(err) } as const
      })
}
