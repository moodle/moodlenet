import env from './mailgun.env'
import createMailgun from 'mailgun-js'
import { EmailSender } from '../../types'

export type Cfg = {
  mailgunCfg: createMailgun.ConstructorParams
}

const mailgun = createMailgun({
  ...env,
})

const sendEmail: EmailSender['sendEmail'] = (req) =>
  mailgun
    .messages()
    .send(req)
    .then((resp) => ({ success: true, id: resp.id } as const))
    .catch((err) => ({ success: false, error: String(err) } as const))

export const mailgunImpl: EmailSender = {
  sendEmail,
}
