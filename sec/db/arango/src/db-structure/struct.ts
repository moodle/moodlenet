import { modConfigName, ModConfigs } from '@moodle/domain'
import { Database } from 'arangojs'
import { userAccountDocument } from '../sec/user-account-db/user-account-types'
import { userProfileDocument } from '../sec/user-profile-db/user-profile-types'
import { databaseConnections } from './types'
import {
  eduBloomCognitiveDocument,
  eduIscedFieldDocument,
  eduIscedLevelDocument,
  eduResourceTypeDocument,
} from '../sec/edu-db'
import { contentLanguageDocument, contentLicenseDocument } from '../sec/content-db'

export function getDbStruct(databaseConnections: databaseConnections) {
  const baseConnectionConfig = {
    keepalive: true,
    retryOnConflict: 5,
  }
  const data_db = new Database({ ...baseConnectionConfig, ...databaseConnections.data })
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
    data: {
      db: data_db,
      coll: {
        userProfile: data_db.collection<userProfileDocument>('userProfile'),
        eduIscedField: data_db.collection<eduIscedFieldDocument>('eduIscedField'),
        eduIscedLevel: data_db.collection<eduIscedLevelDocument>('eduIscedLevel'),
        eduBloomCognitive: data_db.collection<eduBloomCognitiveDocument>('eduBloomCognitive'),
        eduResourceType: data_db.collection<eduResourceTypeDocument>('eduResourceType'),
        contentLanguage: data_db.collection<contentLanguageDocument>('contentLanguage'),
        contentLicense: data_db.collection<contentLicenseDocument>('contentLicense'),
      },
    },
    userAccount: {
      db: user_account_db,
      coll: {
        user: user_account_db.collection<userAccountDocument>('user'),
      },
    },
  }
}
