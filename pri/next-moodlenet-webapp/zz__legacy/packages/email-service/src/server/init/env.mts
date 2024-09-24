import { shell } from '../shell.mjs'
import type { NodemailerTransport } from '../types.mjs'

export const env = getEnv()
type Env = {
  nodemailerTransport: NodemailerTransport
  __development_env__send_all_emails_to?: string
}
function getEnv(): Env {
  const config = shell.config
  //FIXME: validate configs
  const env: Env = config
  return env
}
