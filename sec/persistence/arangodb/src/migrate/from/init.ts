import { defaultMoodleEmlPwdAuthConfigs_0_1 } from '@moodle/mod/eml-pwd-auth/setup/0_1'
import { defaultMoodleNetConfigs_0_1 } from '@moodle/mod/net/setup/0_1'
import { Database } from 'arangojs'
import { db_struct_0_1, Migration_0_1 } from '../../dbStructure/0_1'
import { moodle_eml_pwd_auth_0_1, moodle_net_0_1 } from '../../sec/moodle'

const target_v = '0_1'
export default async function initialize({ db_struct_0_1 }: { db_struct_0_1: db_struct_0_1 }) {
  // create databases
  const data_db_sys = new Database(db_struct_0_1.dbs_struct_configs_0_1.data.url)
  await data_db_sys.createDatabase(db_struct_0_1.data.db.name)
  const iam_db_sys = new Database(db_struct_0_1.dbs_struct_configs_0_1.iam.url)
  await iam_db_sys.createDatabase(db_struct_0_1.iam.db.name)

  // create collections
  await db_struct_0_1.data.coll.self.migrations.create({ cacheEnabled: false })
  await db_struct_0_1.data.coll.module_configs.create({ cacheEnabled: true })

  // fill mod configs
  await db_struct_0_1.data.coll.module_configs.saveAll([
    {
      _key: moodle_eml_pwd_auth_0_1,
      ...defaultMoodleEmlPwdAuthConfigs_0_1,
    },
    {
      _key: moodle_net_0_1,
      ...defaultMoodleNetConfigs_0_1,
    },
  ])

  // bump_version
  const migrationDoc: Migration_0_1 = {
    v: '0_1',
    previous: 'null',
    current: target_v,
    date: new Date().toISOString(),
    meta: 'initialization',
  }
  await db_struct_0_1.data.coll.self.migrations.saveAll(
    [
      {
        _key: `${migrationDoc.previous}::${migrationDoc.current}`,
        ...migrationDoc,
      },
      {
        _key: 'latest',
        ...migrationDoc,
      },
    ],
    { overwriteMode: 'replace' },
  )
  return target_v
}
