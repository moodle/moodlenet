import { Database } from 'arangojs'
import { db_struct_v1_0, Migration_v1_0 } from '../../dbStructure/v1_0'
import { defaultIamConfigs_v1_0 } from '@moodle/mod-iam/v1_0_setup'
import { defaultNetConfigs_v1_0 } from '@moodle/mod-net/v1_0_setup'
import { defaultNetWebappNextjsConfigs_v1_0 } from '@moodle/mod-net-webapp-nextjs/v1_0_setup'
import { defaultOrgConfigs_v1_0 } from '@moodle/mod-org/v1_0_setup'
import { saveModConfigs } from '../../lib/modules'

export const VERSION = 'v1_0'
export async function migrate({ db_struct_v1_0 }: { db_struct_v1_0: db_struct_v1_0 }) {
  // create databases

  const data_db_sys = new Database(db_struct_v1_0.dbs_struct_configs_v1_0.data.url)
  await data_db_sys.createDatabase(db_struct_v1_0.data.db.name)
  const iam_db_sys = new Database(db_struct_v1_0.dbs_struct_configs_v1_0.iam.url)
  await iam_db_sys.createDatabase(db_struct_v1_0.iam.db.name)

  // create collections
  // mng
  await db_struct_v1_0.mng.coll.module_configs.create({ cacheEnabled: true })

  // iam
  await db_struct_v1_0.iam.coll.user.create({})
  // data
  //  await db_struct_v1_0.data.coll.xxx.create({})

  await Promise.all([
    saveModConfigs({
      db_struct_v1_0,
      configs: defaultIamConfigs_v1_0,
      mod_id: { ns: 'moodle', mod: 'iam', version: 'v1_0' },
    }),
    saveModConfigs({
      db_struct_v1_0,
      configs: defaultNetConfigs_v1_0,
      mod_id: { ns: 'moodle', mod: 'net', version: 'v1_0' },
    }),
    saveModConfigs({
      db_struct_v1_0,
      configs: defaultNetWebappNextjsConfigs_v1_0,
      mod_id: { ns: 'moodle', mod: 'netWebappNextjs', version: 'v1_0' },
    }),
    saveModConfigs({
      db_struct_v1_0,
      configs: defaultOrgConfigs_v1_0,
      mod_id: { ns: 'moodle', mod: 'org', version: 'v1_0' },
    }),
  ])

  // bump_version
  const migrationDoc: Migration_v1_0 = {
    v: 'v1_0',
    previous: 'null',
    current: VERSION,
    date: new Date().toISOString(),
    meta: 'initialization',
  }

  return migrationDoc
}
