import env from '../env'
import { setupDb } from './db'
;(async () => {
  await setupDb({ env: env.db, actionOnDBExists: 'abort' })
})()
