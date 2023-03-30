import { getMyDB } from '@moodlenet/arangodb/server'
import { shell } from './shell.mjs'

export const { db } = await shell.call(getMyDB)()

export const env = getEnv()
function getEnv(): Env {
  const config = shell.config ?? {}
  return config
}
export type Env = { rootPassword?: string }
