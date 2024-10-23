import { net_webapp_nextjs_default_configs } from '@moodle/module/net-webapp-nextjs/setup'
import { net_default_configs } from '@moodle/module/net/setup'
import { org_default_configs } from '@moodle/module/org/setup'
import { storage_default_configs } from '@moodle/module/storage/setup'
import { userAccount_default_configs } from '@moodle/module/user-account/setup'
import { user_profile_default_configs } from '@moodle/module/user-profile/setup'
import { db_struct } from '../../db-structure'
import { saveModConfigs } from '../../lib/modules'
import { Migration_Record } from '../types'
// import { removePropOnInsert } from '../lib/id'

export const VERSION = 'v0_1'
export async function migrate({ db_struct }: { db_struct: db_struct }) {
  // create databases

  await db_struct.sys_db.createDatabase(db_struct.data.db.name)
  await db_struct.sys_db.createDatabase(db_struct.userAccount.db.name)

  // create collections
  // mng
  await db_struct.mng.coll.module_configs.create({ cacheEnabled: true })

  // userAccount
  await db_struct.userAccount.coll.user.create(/* { computedValues: [removePropOnInsert('id')] } */)
  db_struct.userAccount.coll.user.ensureIndex({
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
      configs: userAccount_default_configs,
      moduleName: 'userAccount',
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
      configs: user_profile_default_configs,
      moduleName: 'userProfile',
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
