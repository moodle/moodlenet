import { getConfig } from '@moodlenet/core'
import { NodemailerTransport } from './types.mjs'

export const env = await getEnv()

type Env = {
  nodemailerTransport: NodemailerTransport
}
async function getEnv(): Promise<Env> {
  const config = await getConfig(import.meta)
  const env: Env = config
  return env
}
