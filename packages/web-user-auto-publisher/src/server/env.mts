import { shell } from './shell.mjs'

type Env = {
  amountForAutoApproval: number
  noBgProc: boolean
}

export const env = getEnv()

function getEnv(): Env {
  const config = shell.config ?? {}
  const env: Env = {
    amountForAutoApproval: config.amountForAutoApproval || 3,
    noBgProc: config.noBgProc === true,
  }

  return env
}
