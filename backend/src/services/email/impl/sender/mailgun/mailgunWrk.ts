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
    .then((resp) => ({ id: resp.id }))
    .catch((err) => {
      return {
        error: String(err),
      }
    })

const mailgunImpl: EmailSenderImpl = {
  sendEmail,
}

module.exports = mailgunImpl
