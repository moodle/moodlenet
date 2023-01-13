import { Config } from 'arangojs/connection.js'
import shell from './shell.mjs'

export const env = await getEnv()

type Env = {
  connectionCfg: Config
}

async function getEnv(): Promise<Env> {
  const config = shell.config
  // FIXME: validate configs
  const env: Env = config
  return env
}
