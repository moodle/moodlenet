import { migrate } from '@moodle/sec-db-arango/migrate'
import { getEnv } from './getEnv'

getEnv({
  type: 'system',
  mod_id: {
    ns: 'moodle',
    mod: 'monolith',
    version: '1.0.0',
  },
  domain: { host: process.env.MOODLE_MONOLITH_MIGRATE_DOMAIN_HOST ?? 'http://127.0.0.1' },
})
  .then(env => migrate(env.arango_db))
  .then(console.log)
  .catch(console.error)
