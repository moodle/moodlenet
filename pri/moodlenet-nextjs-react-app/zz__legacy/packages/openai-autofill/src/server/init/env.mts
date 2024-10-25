import { shell } from '../shell.mjs'

export const env = getEnv()
type Env = {
  tikaUrl: string
  apiKey: string
  cutContentToCharsAmount: number
  noBgProc: boolean
}
function getEnv(): Env {
  const config = shell.config
  const env: Env = {
    tikaUrl: String(config.tikaUrl),
    apiKey: config.apiKey,
    cutContentToCharsAmount: Number(config.cutContentToCharsAmount ?? 20_000),
    noBgProc: config.noBgProc === true,
  }

  return env
}
