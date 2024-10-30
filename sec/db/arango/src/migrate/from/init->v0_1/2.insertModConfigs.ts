import { moodlenet_react_app_default_configs } from '@moodle/module/moodlenet-react-app/setup'
import { moodlenet_default_configs } from '@moodle/module/moodlenet/setup'
import { org_default_configs } from '@moodle/module/org/setup'
import { storage_default_configs } from '@moodle/module/storage/setup'
import { userAccount_default_configs } from '@moodle/module/user-account/setup'
import { user_profile_default_configs } from '@moodle/module/user-profile/setup'
import { dbStruct } from '../../../db-structure'
import { saveModConfigs } from '../../../lib/modules'
import { edu_default_configs } from '@moodle/module/edu/setup'
// import { removePropOnInsert } from '../lib/id'

export async function insertModConfigs({ dbStruct }: { dbStruct: dbStruct }) {
  await saveModConfigs({
    dbStruct,
    configs: userAccount_default_configs,
    moduleName: 'userAccount',
  })
  await saveModConfigs({
    dbStruct,
    configs: moodlenet_default_configs,
    moduleName: 'moodlenet',
  })
  await saveModConfigs({
    dbStruct,
    configs: moodlenet_react_app_default_configs,
    moduleName: 'moodlenetReactApp',
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
  await saveModConfigs({
    dbStruct,
    configs: edu_default_configs,
    moduleName: 'edu',
  })
}
