import { shell } from '../shell.mjs'

export const env = getEnv()
function getEnv(): Env {
  const config = shell.config ?? {}
  return config
}
export type Env = { rootPassword?: string }
