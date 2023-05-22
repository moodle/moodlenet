import { shell } from '../shell.mjs'

export const env = getEnv()
type Env = {
  noWebappServer: boolean
}
function getEnv(): Env {
  const config = shell.config
  //FIXME: validate configs
  const env: Env = {
    noWebappServer: false,
    ...config,
  }

  return env
}
