import { createTransport } from 'nodemailer'
// import { EmailSender } from '../types'


// questo  è un factory , e
type Config = { smtp: string }
export const getNodemailerSendEmailAdapter = ({ smtp }: Config): any => {
  const emailSender = createTransport(smtp)
  return (emailObj: any) =>
    emailSender
      .sendMail(emailObj)
      .then((resp: { messageId: any }) => ({ success: true, emailId: resp.messageId } as const))
      //.catch(err => ({ success: false, error: String(err) } as const))
      .catch((err: any) => {
        console.error(`NodeMailer failed to send email`, emailObj, err)
        return { success: false, error: String(err) } as const
      })
}
