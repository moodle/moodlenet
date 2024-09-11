import { Database } from 'arangojs'
import { db_struct_0_1, Migration_0_1 } from '../../dbStructure/0_1'
import { defaultIamConfigs_0_1 } from '@moodle/mod-iam/0_1_setup'
import { defaultNetConfigs_0_1 } from '@moodle/mod-net/0_1_setup'
import { defaultNetWebappNextjsConfigs_0_1 } from '@moodle/mod-net-webapp-nextjs/0_1_setup'
import { defaultOrgConfigs_0_1 } from '@moodle/mod-org/0_1_setup'
import { saveModConfigs } from '../../lib/modules'

export const VERSION = 'v0_1'
export async function migrate({ db_struct_0_1 }: { db_struct_0_1: db_struct_0_1 }) {
  // create databases

  const data_db_sys = new Database(db_struct_0_1.dbs_struct_configs_0_1.data.url)
  await data_db_sys.createDatabase(db_struct_0_1.data.db.name)
  const iam_db_sys = new Database(db_struct_0_1.dbs_struct_configs_0_1.iam.url)
  await iam_db_sys.createDatabase(db_struct_0_1.iam.db.name)

  // create collections
  // mng
  await db_struct_0_1.mng.coll.module_configs.create({ cacheEnabled: true })

  // iam
  await db_struct_0_1.iam.coll.user.create({})
  // data
  //  await db_struct_0_1.data.coll.xxx.create({})

  await Promise.all([
    saveModConfigs({
      db_struct_0_1,
      configs: defaultIamConfigs_0_1,
      mod_id: { ns: 'moodle', mod: 'iam', version: 'v0_1' },
    }),
    saveModConfigs({
      db_struct_0_1,
      configs: defaultNetConfigs_0_1,
      mod_id: { ns: 'moodle', mod: 'net', version: 'v0_1' },
    }),
    saveModConfigs({
      db_struct_0_1,
      configs: defaultNetWebappNextjsConfigs_0_1,
      mod_id: { ns: 'moodle', mod: 'netWebappNextjs', version: 'v0_1' },
    }),
    saveModConfigs({
      db_struct_0_1,
      configs: defaultOrgConfigs_0_1,
      mod_id: { ns: 'moodle', mod: 'org', version: 'v0_1' },
    }),
  ])

  // bump_version
  const migrationDoc: Migration_0_1 = {
    v: '0_1',
    previous: 'null',
    current: VERSION,
    date: new Date().toISOString(),
    meta: 'initialization',
  }

  return migrationDoc
}
