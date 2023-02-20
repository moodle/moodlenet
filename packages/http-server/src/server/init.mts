import { shell } from './shell.mjs'

export const env = await getEnv()

type Env = {
  port: number
  protocol: string
}
function getEnv(): Env {
  const config: Env = {
    port: shell.config.port,
    protocol: shell.config.protocol,
  }
  //FIXME: validate configs
  const env: Env = config
  return env
}
