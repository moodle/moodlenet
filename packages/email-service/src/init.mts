import { MailerCfg } from './emailSender/nodemailer/nodemailer.mjs'

export const env = getEnv(null)

type Env =
  | Partial<{
      mailerCfg: MailerCfg
    }>
  | undefined
function getEnv(_: any): Env {
  // mailerCfg:{jsonTransport}
  return _
    ? {
        mailerCfg: _.mailerCfg,
      }
    : undefined
}
