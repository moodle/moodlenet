import { shell } from '../shell.mjs'
import type { NodemailerTransport } from '../types.mjs'

export const env = getEnv()
type Env = {
  nodemailerTransport: NodemailerTransport
}
function getEnv(): Env {
  const config = shell.config
  //FIXME: validate configs
  const env: Env = config
  return env
}
