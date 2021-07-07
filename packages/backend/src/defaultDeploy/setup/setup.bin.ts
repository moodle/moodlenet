import env from '../env'
import { setupDb } from './db'
const forceDrop = process.env.FORCE_DROP_DBS === 'true'
;(async () => {
  await setupDb({ env: env.db, actionOnDBExists: forceDrop ? 'drop' : 'abort' })
})()
