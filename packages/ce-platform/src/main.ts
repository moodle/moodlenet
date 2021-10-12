import env from './env'
import { setupDb } from './setup/db'
import { startDefaultMoodlenet } from './start'
;(async () => {
  await setupDb({ env: env.db, actionOnDBExists: 'upgrade' })
  startDefaultMoodlenet({ env })
})()
