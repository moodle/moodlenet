import env from './mailgun.env'
import createMailgun from 'mailgun-js'
import { EmailSenderImpl, SendEmailProgressKO, SendEmailProgressOK } from '../../../types'

export type Cfg = {
  mailgunCfg: createMailgun.ConstructorParams
}

const mailgun = createMailgun({
  ...env,
})
const sendEmail: EmailSenderImpl['sendEmail'] = (req) => (
  console.log(req),
  mailgun
    .messages()
    .send(req)
    .then((resp) => (console.log(resp), resp))

    .then<SendEmailProgressOK>((resp) => ({ id: resp.id, type: 'SendEmailProgressOK' }))
    .catch<SendEmailProgressKO>((err) => {
      console.log('ERR', err)
      return {
        type: 'SendEmailProgressKO',
        error: String(err),
      }
    })
)
const mailgunImpl: EmailSenderImpl = {
  sendEmail,
}

module.exports = mailgunImpl
