import { env } from './env.mjs'

if (!env.noBgProc) {
  //await import('./start/digestActivitiesProcess.mjs')
  await import('./start/syncPointsProcess.mjs')
}
