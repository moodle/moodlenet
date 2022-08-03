import { createTransport } from 'nodemailer';
// import { EmailSender } from '../types's


export type SendResp = {
  readonly success: true;
  readonly emailId: string;
} | {
  readonly success: false;
  readonly error: string;
}

// questo  è un factory , e
// type Config = { smtp: string }
export const getNodemailerSendEmailAdapter = (configLocal:any) => {
  const emailSender = createTransport(configLocal)
  return (emailObj: any):Promise<SendResp> =>
    emailSender
      .sendMail(emailObj)
      .then((resp: { messageId: string }) => ({ success: true, emailId: resp.messageId } as const))
      //.catch(err => ({ success: false, error: String(err) } as const))
      .catch((err: any) => {
        console.error(`NodeMailer failed to send email`, emailObj, err)
        return { success: false, error: String(err) } as const
      })
}
