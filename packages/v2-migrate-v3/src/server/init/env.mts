import type { Config } from 'arangojs/connection.js'
import assert from 'assert'
import { shell } from '../shell.mjs'

export const env = getEnv()
assert(env.v2DbConnectionCfg && env.v2AssetFolder, 'need a v2DbConnectionCfg and a v2AssetFolder')
function getEnv(): Env {
  const config = shell.config
  // FIXME: validate configs
  const env: Env = config
  return env
}
type Env = { v2DbConnectionCfg: Config; v2AssetFolder: string }
