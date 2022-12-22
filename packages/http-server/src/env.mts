import { getConfig } from '@moodlenet/core'
import { createHttpServer } from './http-server.mjs' //FIXME: circular dep

export const env = await getEnv()
export const httpServer = await createHttpServer()

type Env = {
  port: number
}
async function getEnv(): Promise<Env> {
  const config = await getConfig(import.meta)
  const env: Env = config
  return env
}
