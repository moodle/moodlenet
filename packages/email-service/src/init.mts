import { MailerCfg } from './types.mjs'

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
