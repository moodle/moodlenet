import { iam_default_configs } from '@moodle/mod-iam/setup'
import { net_webapp_nextjs_default_configs } from '@moodle/mod-net-webapp-nextjs/setup'
import { net_default_configs } from '@moodle/mod-net/setup'
import { org_default_configs } from '@moodle/mod-org/setup'
import { storage_default_configs } from '@moodle/mod-storage/setup'
import { user_home_default_configs } from '@moodle/mod-user-home/setup'
import { db_struct } from '../../db-structure'
import { saveModConfigs } from '../../lib/modules'
import { Migration_Record } from '../types'
// import { removePropOnInsert } from '../lib/id'

export const VERSION = 'v0_1'
export async function migrate({ db_struct }: { db_struct: db_struct }) {
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
  //  await db_struct.data.coll.xxx.create({})

  await Promise.all([
    saveModConfigs({
      db_struct,
      configs: iam_default_configs,
      moduleName: 'iam',
    }),
    saveModConfigs({
      db_struct,
      configs: net_default_configs,
      moduleName: 'net',
    }),
    saveModConfigs({
      db_struct,
      configs: net_webapp_nextjs_default_configs,
      moduleName: 'netWebappNextjs',
    }),
    saveModConfigs({
      db_struct,
      configs: org_default_configs,
      moduleName: 'org',
    }),
    saveModConfigs({
      db_struct,
      configs: user_home_default_configs,
      moduleName: 'userHome',
    }),
    saveModConfigs({
      db_struct,
      configs: storage_default_configs,
      moduleName: 'storage',
    }),
  ])
  // bump_version
  const migrationDoc: Migration_Record = {
    previous: 'null',
    current: VERSION,
    date: new Date().toISOString(),
    meta: 'initialization',
  }

  return migrationDoc
}
