import createMailgun from 'mailgun-js'
import { EmailQueueWorkers } from '../../email.queue.types'
const MAILGUN_API_KEY = process.env.EMAIL_MAILGUN_API_KEY || ''
const MAILGUN_DOMAIN = process.env.EMAIL_MAILGUN_DOMAIN || ''

export type Cfg = {
  mailgunCfg: createMailgun.ConstructorParams
}
export type Opts = {}

const mailgun = createMailgun({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
})
const sendEmail: EmailQueueWorkers['sendEmail'] = (req) =>
  mailgun
    .messages()
    .send(req)
    .then((resp) => ({ id: resp.id }))
    .catch((err) => {
      return {
        error: String(err),
      }
    })

const methods: EmailQueueWorkers = {
  sendEmail,
}

module.exports = methods
