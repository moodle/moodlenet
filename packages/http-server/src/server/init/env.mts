import { shell } from '../shell.mjs'

export const env = await getEnv()

type Env = {
  port: number
  disabled: boolean
}
function getEnv(): Env {
  const config: Env = {
    port: shell.config.port,
    disabled: !!shell.config.disabled,
  }
  //FIXME: validate configs
  const env: Env = config
  return env
}
