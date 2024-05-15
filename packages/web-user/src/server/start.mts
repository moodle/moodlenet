import { env } from './env.mjs'

if (!env.noBgProc) {
  await import('./start/manageInactiveUsers.mjs')
  await import('./start/syncPointsProcess.mjs')
}
