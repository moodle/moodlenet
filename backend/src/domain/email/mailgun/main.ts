import createMailgun from 'mailgun-js'
import { Workers } from '@mn-be/domain/email'

export type Cfg = {
  mailgunCfg: createMailgun.ConstructorParams
}
export type Opts = {}

export const makeWorkers = ({ mailgunCfg }: Cfg, {}: Opts): Workers => {
  const mailgun = createMailgun(mailgunCfg)
  const sendEmail: Workers['sendEmail'] = (req) =>
    mailgun
      .messages()
      .send(req)
      .then((resp) => ({ id: resp.id }))
      .catch((err) => {
        return {
          error: String(err),
        }
      })

  return {
    sendEmail,
  }
}
