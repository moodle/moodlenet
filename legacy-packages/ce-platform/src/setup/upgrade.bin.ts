import env from '../env'
import { upgradeToLatestDb } from './db'
;(async () => {
  await upgradeToLatestDb({ env: env.db })
})()
