import createMailgun from 'mailgun-js'
import { SockOf } from '../../../lib/plug'
import { adapter } from '../../../ports/system/sendEmail'

export const getMailgunSendEmailAdapter = (cfg: createMailgun.ConstructorParams): SockOf<typeof adapter> => {
  const mailgun = createMailgun(cfg)

  return req =>
    mailgun
      .messages()
      .send(req)
      .then(resp => ({ success: true, emailId: resp.id } as const))
      .catch(err => ({ success: false, error: String(err) } as const))
}
