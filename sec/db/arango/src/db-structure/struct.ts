import { job } from '@moodle/lib-job-queue-service'
import { any_, d_u } from '@moodle/lib-types'
import { Database } from 'arangojs'
import { activeSessionData } from 'domain/src/domain/model/accessControl.model/accessControl.model'
import { contributorSpace } from 'domain/src/domain/model/moodlenet.model/moodlenet.model'
import { userSpace } from 'domain/src/domain/model/userAccount.model/userAccount.model'
import { dbUpgradeData } from '../dbUpgrade/types'
import { databaseConnections } from './types'
import { bloomCognitive, iscedField, iscedLevel, resourceType } from 'domain/src/domain/model/education.model'
import { language, license } from 'domain/src/domain/model/contentCategories.model'

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
        eduIscedField: appData_db.collection<{ data: iscedField }>('eduIscedField'),
        eduIscedLevel: appData_db.collection<{ data: iscedLevel }>('eduIscedLevel'),
        eduBloomCognitive: appData_db.collection<{ data: bloomCognitive }>('eduBloomCognitive'),
        eduResourceType: appData_db.collection<{ data: resourceType }>('eduResourceType'),
        contentLanguage: appData_db.collection<{ data: language }>('contentLanguage'),
        contentLicense: appData_db.collection<{ data: license }>('contentLicense'),
        user: identity_db.collection<{
          userAccount: { user: moo.model.type.sSpaceData<userSpace> }
          moodlenet: { contributor: moo.model.type.sSpaceData<contributorSpace> }
        }>('user'),
      },
    },
    modules: {
      db: services_db,
      coll: {
        modelConfig: services_db.collection<d_u<moo.modelConfigs, 'model'>>('modelConfig'),
      },
    },
    services: {
      db: services_db,
      coll: {
        dbUpgrade: services_db.collection<dbUpgradeData>('dbUpgrade'),
        domainAccessJob: services_db.collection<job<{ access: moo.model.access<any_> }>>('domainAccessJob'),
        activeUserSession: services_db.collection<{ data: activeSessionData }>('activeUseSession'),
      },
    },
  }
}
