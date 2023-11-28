import { shell } from '../shell.mjs'

export const env = getEnv()
type Env = {
  apiKey: string
  cutContentToCharsAmount: number
}
function getEnv(): Env {
  const config = shell.config
  const env: Env = {
    apiKey: config.apiKey,
    cutContentToCharsAmount: Number(config.cutContentToCharsAmount ?? 10_000),
  }

  return env
}
