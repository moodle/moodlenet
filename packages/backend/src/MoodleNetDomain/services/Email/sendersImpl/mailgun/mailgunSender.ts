import createMailgun from 'mailgun-js'
import { EmailSender } from '../types'

export const createMailgunSender = (cfg: createMailgun.ConstructorParams) => {
  const mailgun = createMailgun(cfg)

  const sendEmail: EmailSender['sendEmail'] = req =>
    mailgun
      .messages()
      .send(req)
      .then(resp => ({ success: true, emailId: resp.id } as const))
      .catch(err => ({ success: false, error: String(err) } as const))

  const mailgunImpl: EmailSender = {
    sendEmail,
  }

  return mailgunImpl
}
