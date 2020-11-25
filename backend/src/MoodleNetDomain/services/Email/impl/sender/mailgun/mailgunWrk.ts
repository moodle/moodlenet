import env from './mailgun.env'
import createMailgun from 'mailgun-js'
import { EmailSenderImpl } from '../../../types'

export type Cfg = {
  mailgunCfg: createMailgun.ConstructorParams
}

const mailgun = createMailgun({
  ...env,
})
const sendEmail: EmailSenderImpl['sendEmail'] = (req) =>
  mailgun
    .messages()
    .send(req)
    .then((resp) => ({ success: true, id: resp.id } as const))
    .catch((err) => ({ success: false, error: String(err) } as const))

const mailgunImpl: EmailSenderImpl = {
  sendEmail,
}

module.exports = mailgunImpl
