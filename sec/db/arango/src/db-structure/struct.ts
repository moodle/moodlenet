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
  const appData_db = new Database({ ...baseConnectionConfig, ...databaseConnections.appData })
  const identity_db = new Database({ ...baseConnectionConfig, ...databaseConnections.identity })
  const logs_db = new Database({ ...baseConnectionConfig, ...databaseConnections.logs })
  const sys_db = new Database({
    ...baseConnectionConfig,
    // databaseName: '_system',
  })

  return {
    connections: databaseConnections,
    sys_db,
    logs: {
      db: logs_db,
      coll: {
        migrations: logs_db.collection('migrations'),
      },
    },
    appData: {
      db: appData_db,
      coll: {
        moduleConfigs: appData_db.collection<ModConfigs[modConfigName]>('moduleConfigs'),
        eduIscedField: appData_db.collection<record_doc<eduIscedFieldRecord, 'code'>>('eduIscedField'),
        eduIscedLevel: appData_db.collection<record_doc<eduIscedLevelRecord, 'code'>>('eduIscedLevel'),
        eduBloomCognitive: appData_db.collection<record_doc<eduBloomCognitiveRecord, 'level'>>('eduBloomCognitive'),
        eduResourceType: appData_db.collection<record_doc<eduResourceTypeRecord, 'code'>>('eduResourceType'),
        contentLanguage: appData_db.collection<record_doc<contentLanguageRecord, 'code'>>('contentLanguage'),
        contentLicense: appData_db.collection<record_doc<contentLicenseRecord, 'code'>>('contentLicense'),
        contributor: appData_db.collection<record_doc<moodlenetContributorRecord>>('contributor'),
        userProfile: appData_db.collection<record_doc<userProfileRecord>>('userProfile'),
      },
    },
    identity: {
      db: identity_db,
      coll: {
        userAccount: identity_db.collection<record_doc<userAccountRecord>>('userAccount'),
      },
    },
  }
}
