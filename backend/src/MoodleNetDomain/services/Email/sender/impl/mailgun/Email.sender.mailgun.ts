import env from './Email.sender.mailgun.env'
import createMailgun from 'mailgun-js'
import { EmailSender } from '../../types'

export type Cfg = {
  mailgunCfg: createMailgun.ConstructorParams
}

const mailgun = createMailgun({
  ...env,
})

const sendEmail: EmailSender['sendEmail'] = async (req) => {
  try {
    const resp = await mailgun.messages().send(req)
    return { success: true, emailId: resp.id }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export const mailgunImpl: EmailSender = {
  sendEmail,
}
