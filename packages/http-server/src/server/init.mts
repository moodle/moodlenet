import { shell } from './shell.mjs'

export const env = await getEnv()

type Env = {
  port: number
  // secure?: SecureHttpConfig
}
function getEnv(): Env {
  const config: Env = {
    port: shell.config.port,
  }
  //FIXME: validate configs
  const env: Env = config
  return env
}
