import { Config } from 'arangojs/connection.js'
import { getConfig } from '@moodlenet/core'

export const env = await getEnv()

type Env = {
  connectionCfg: Config
}

async function getEnv(): Promise<Env> {
  const config = await getConfig(import.meta)
  const env: Env = config
  return env
}
