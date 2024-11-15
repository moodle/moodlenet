import { modConfigName, ModConfigs } from '@moodle/domain'
import { Database } from 'arangojs'
import { databaseConnections } from './types'
import { userProfileRecord } from '@moodle/module/user-profile'
import { eduBloomCognitiveRecord, eduIscedFieldRecord, eduIscedLevelRecord, eduResourceTypeRecord } from '@moodle/module/edu'
import { contentLanguageRecord, contentLicenseRecord } from '@moodle/module/content'
import { userAccountRecord } from '@moodle/module/user-account'
import { record_doc } from '../lib/key-id-mapping'
import { moodlenetContributorRecord } from '@moodle/module/moodlenet'

export function getDbStruct(databaseConnections: databaseConnections) {
  const baseConnectionConfig = {
    keepalive: true,
    retryOnConflict: 5,
  }
  const moodlenet_db = new Database({ ...baseConnectionConfig, ...databaseConnections.moodlenet })
  const user_account_db = new Database({ ...baseConnectionConfig, ...databaseConnections.userAccount })
  const mng_db = new Database({ ...baseConnectionConfig, ...databaseConnections.modules })
  const sys_db = new Database({
    ...baseConnectionConfig,
    ...databaseConnections.modules,
    databaseName: '_system',
  })

  return {
    connections: databaseConnections,
    sys_db,
    modules: {
      db: mng_db,
      coll: {
        moduleConfigs: mng_db.collection<ModConfigs[modConfigName]>('moduleConfigs'),
        migrations: mng_db.collection('migrations'),
      },
    },
    moodlenet: {
      db: moodlenet_db,
      coll: {
        eduIscedField: moodlenet_db.collection<record_doc<eduIscedFieldRecord, 'code'>>('eduIscedField'),
        eduIscedLevel: moodlenet_db.collection<record_doc<eduIscedLevelRecord, 'code'>>('eduIscedLevel'),
        eduBloomCognitive: moodlenet_db.collection<record_doc<eduBloomCognitiveRecord, 'level'>>('eduBloomCognitive'),
        eduResourceType: moodlenet_db.collection<record_doc<eduResourceTypeRecord>>('eduResourceType'),
        contentLanguage: moodlenet_db.collection<record_doc<contentLanguageRecord, 'code'>>('contentLanguage'),
        contentLicense: moodlenet_db.collection<record_doc<contentLicenseRecord, 'code'>>('contentLicense'),
        contributor: moodlenet_db.collection<record_doc<moodlenetContributorRecord>>('contributor'),
      },
    },
    userAccount: {
      db: user_account_db,
      coll: {
        userProfile: moodlenet_db.collection<record_doc<userProfileRecord>>('userProfile'),
        userAccount: user_account_db.collection<record_doc<userAccountRecord>>('userAccount'),
      },
    },
  }
}
