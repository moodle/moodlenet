import { job } from '@moodle/lib-job-queue-service'
import { any_ } from '@moodle/lib-types'
import { Database } from 'arangojs'
import { activeSessionData } from 'domain/src/domain/model/accessControl.model/accessControl.model'
import { contributorSpace } from 'domain/src/domain/model/moodlenet.model/moodlenet.model'
import { userSpace } from 'domain/src/domain/model/userAccount.model/userAccount.model'
import { dbMigrationRecord } from '../migrate/types'
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
        eduIscedField: appData_db.collection<{ data: eduIscedField }>('eduIscedField'),
        eduIscedLevel: appData_db.collection<{ data: eduIscedLevel }>('eduIscedLevel'),
        eduBloomCognitive: appData_db.collection<{ data: eduBloomCognitive }>('eduBloomCognitive'),
        eduResourceType: appData_db.collection<{ data: eduResourceType }>('eduResourceType'),
        contentLanguage: appData_db.collection<{ data: contentLanguage }>('contentLanguage'),
        contentLicense: appData_db.collection<{ data: contentLicense }>('contentLicense'),
        user: identity_db.collection<{
          userAccount: { user: moo.model.type.spaceData<userSpace> }
          moodlenet: null | { contributor: moo.model.type.spaceData<contributorSpace> }
        }>('user'),
      },
    },
    services: {
      db: services_db,
      coll: {
        dbMigrations: services_db.collection<dbMigrationRecord>('dbMigrations'),
        domainAccessJob: services_db.collection<job<{ access: moo.model.access<any_> }>>('domainAccessJob'),
        activeUserSession: services_db.collection<{ data: activeSessionData }>('activeUseSession'),
      },
    },
  }
}
