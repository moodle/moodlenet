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
    .then((resp) => ({ _state: 'SendEmailProgressOK', id: resp.id } as const))
    .catch((err) => ({ _state: 'SendEmailProgressKO', error: String(err) } as const))

const mailgunImpl: EmailSenderImpl = {
  sendEmail,
}

module.exports = mailgunImpl
