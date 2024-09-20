import { iam_default_configs } from '@moodle/mod-iam/v1_0/setup'
import { net_webapp_nextjs_default_configs } from '@moodle/mod-net-webapp-nextjs/v1_0/setup'
import { net_default_configs } from '@moodle/mod-net/v1_0/setup'
import { org_default_configs } from '@moodle/mod-org/v1_0/setup'
import { v1_0 } from '../..'
import { saveModConfigs } from '../../v1_0/lib/modules'
// import { removePropOnInsert } from '../lib/id'

export const VERSION = 'v0_1'
export async function migrate({ db_struct }: { db_struct: v1_0.db_struct }) {
  // create databases

  await db_struct.sys_db.createDatabase(db_struct.data.db.name)
  await db_struct.sys_db.createDatabase(db_struct.iam.db.name)

  // create collections
  // mng
  await db_struct.mng.coll.module_configs.create({ cacheEnabled: true })

  // iam
  await db_struct.iam.coll.user.create(/* { computedValues: [removePropOnInsert('id')] } */)
  db_struct.iam.coll.user.ensureIndex({
    name: 'userEmail',
    type: 'persistent',
    fields: ['contacts.email'],
    unique: true,
  })
  // data
  //  await db_struct_v1_0.data.coll.xxx.create({})

  await Promise.all([
    saveModConfigs({
      db_struct,
      configs: iam_default_configs,
      mod_id: { ns: 'moodle', mod: 'iam', version: 'v1_0' },
    }),
    saveModConfigs({
      db_struct,
      configs: net_default_configs,
      mod_id: { ns: 'moodle', mod: 'net', version: 'v1_0' },
    }),
    saveModConfigs({
      db_struct,
      configs: net_webapp_nextjs_default_configs,
      mod_id: { ns: 'moodle', mod: 'netWebappNextjs', version: 'v1_0' },
    }),
    saveModConfigs({
      db_struct,
      configs: org_default_configs,
      mod_id: { ns: 'moodle', mod: 'org', version: 'v1_0' },
    }),
  ])

  // bump_version
  const migrationDoc: v1_0.Migration = {
    v: 'v1_0',
    previous: 'null',
    current: VERSION,
    date: new Date().toISOString(),
    meta: 'initialization',
  }

  return migrationDoc
}
