import { env } from './env.mjs'

if (!env.noBgProc) {
  await import('./start/inactiveUsersProcess.mjs')
  await import('./start/syncPointsProcess.mjs')
}
