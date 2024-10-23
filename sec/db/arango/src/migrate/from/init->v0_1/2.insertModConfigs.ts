import { net_webapp_nextjs_default_configs } from '@moodle/module/net-webapp-nextjs/setup'
import { net_default_configs } from '@moodle/module/net/setup'
import { org_default_configs } from '@moodle/module/org/setup'
import { storage_default_configs } from '@moodle/module/storage/setup'
import { userAccount_default_configs } from '@moodle/module/user-account/setup'
import { user_profile_default_configs } from '@moodle/module/user-profile/setup'
import { dbStruct } from '../../../db-structure'
import { saveModConfigs } from '../../../lib/modules'
// import { removePropOnInsert } from '../lib/id'

export async function insertModConfigs({ dbStruct }: { dbStruct: dbStruct }) {
  await saveModConfigs({
    dbStruct,
    configs: userAccount_default_configs,
    moduleName: 'userAccount',
  })
  await saveModConfigs({
    dbStruct,
    configs: net_default_configs,
    moduleName: 'net',
  })
  await saveModConfigs({
    dbStruct,
    configs: net_webapp_nextjs_default_configs,
    moduleName: 'netWebappNextjs',
  })
  await saveModConfigs({
    dbStruct,
    configs: org_default_configs,
    moduleName: 'org',
  })
  await saveModConfigs({
    dbStruct,
    configs: user_profile_default_configs,
    moduleName: 'userProfile',
  })
  await saveModConfigs({
    dbStruct,
    configs: storage_default_configs,
    moduleName: 'storage',
  })
}
