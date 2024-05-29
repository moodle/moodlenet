import { shell } from './shell.mjs'

type Env = {
  amountForAutoApproval: number
}

export const env = getEnv()

function getEnv(): Env {
  const config = shell.config ?? {}
  const env: Env = {
    amountForAutoApproval: config.amountForAutoApproval || 3,
  }

  return env
}
