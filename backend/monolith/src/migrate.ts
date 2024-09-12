import { migrate } from '@moodle/sec-db-arango/migrate'
import { get_arango_db_sec_env } from './env'

const arangoDbSecEnv = get_arango_db_sec_env()
migrate(arangoDbSecEnv).then(console.log)
