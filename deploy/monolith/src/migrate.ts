import { migrate } from '@moodle/sec/persistence/arangodb/migrate'
import { get_dbs_struct_configs_0_1 } from './env'

const dbs_struct_configs_0_1 = get_dbs_struct_configs_0_1()
migrate({ dbs_struct_configs_0_1 }).then(console.log)
