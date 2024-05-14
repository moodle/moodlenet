import { shell } from './shell.mjs'

type Env = {
  noBgProc: boolean
  amountForAutoApproval: number
}

export const env = getEnv()

function getEnv(): Env {
  const config = shell.config ?? {}
  const env: Env = {
    noBgProc: !!config.noBgProc,
    amountForAutoApproval: config.amountForAutoApproval || 3,
  }

  return env
}
