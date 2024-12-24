import { modConfigName, ModConfigs } from '@moodle/domain'
import { contentLanguageRecord, contentLicenseRecord } from '@moodle/module/content'
import { eduBloomCognitiveRecord, eduIscedFieldRecord, eduIscedLevelRecord, eduResourceTypeRecord } from '@moodle/module/edu'
import { moodlenetContributorRecord } from '@moodle/module/moodlenet'
import { eduResourceDraftIngestionRecord } from '@moodle/module/resource-ingestion'
import { userAccountRecord } from '@moodle/module/user-account'
import { userProfileRecord } from '@moodle/module/user-profile'
import { Database } from 'arangojs'
import { domain_record_doc } from '../lib/key-id-mapping'
import { migrationRecord } from '../migrate/types'
import { arangoDbJob } from '../services/lib'
import { domainAccessJobData } from '../services/types'
import { databaseConnections } from './types'

export function getDbStruct(databaseConnections: databaseConnections) {
  const baseConnectionConfig = {
    keepalive: true,
    retryOnConflict: 5,
  }
  const appData_db = new Database({ ...baseConnectionConfig, ...databaseConnections.appData })
  const identity_db = new Database({ ...baseConnectionConfig, ...databaseConnections.identity })
  const services_db = new Database({ ...baseConnectionConfig, ...databaseConnections.services })
  const sys_db = new Database({
    ...baseConnectionConfig,
    // databaseName: '_system',
  })

  return {
    connections: databaseConnections,
    sys_db,
    appData: {
      db: appData_db,
      coll: {
        moduleConfigs: appData_db.collection<ModConfigs[modConfigName]>('moduleConfigs'),
        eduIscedField: appData_db.collection<domain_record_doc<eduIscedFieldRecord, 'code'>>('eduIscedField'),
        eduIscedLevel: appData_db.collection<domain_record_doc<eduIscedLevelRecord, 'code'>>('eduIscedLevel'),
        eduBloomCognitive: appData_db.collection<domain_record_doc<eduBloomCognitiveRecord, 'level'>>('eduBloomCognitive'),
        eduResourceType: appData_db.collection<domain_record_doc<eduResourceTypeRecord, 'code'>>('eduResourceType'),
        contentLanguage: appData_db.collection<domain_record_doc<contentLanguageRecord, 'code'>>('contentLanguage'),
        contentLicense: appData_db.collection<domain_record_doc<contentLicenseRecord, 'code'>>('contentLicense'),
        contributor: appData_db.collection<domain_record_doc<moodlenetContributorRecord>>('contributor'),
        userProfile: appData_db.collection<domain_record_doc<userProfileRecord>>('userProfile'),
        eduResourceDraftIngestion:
          appData_db.collection<domain_record_doc<eduResourceDraftIngestionRecord>>('eduResourceDraftIngestion'),
      },
    },
    identity: {
      db: identity_db,
      coll: {
        userAccount: identity_db.collection<domain_record_doc<userAccountRecord>>('userAccount'),
      },
    },
    services: {
      db: services_db,
      coll: {
        migrations: services_db.collection<migrationRecord>('migrations'),
        domainAccessJobs: services_db.collection<arangoDbJob<domainAccessJobData>>('domainAccessJobs'),
      },
    },
  }
}
