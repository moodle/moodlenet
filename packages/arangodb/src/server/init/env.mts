import type { Config } from 'arangojs/connection.js'
import { shell } from '../shell.mjs'

export const env = getEnv()
function getEnv(): Env {
  const config = shell.config
  // FIXME: validate configs
  const env: Env = config
  return env
}
type Env = { connectionCfg: Config }
