import { statics } from '@moodle/domain/model'
import { job } from '@moodle/lib-job-queue-service'
import { any_ } from '@moodle/lib-types'
import { Database } from 'arangojs'
import { dbUpgradeData } from '../dbUpgrade/types'
import {
  appDataBloomCognitiveCollectionData,
  appDataIscedFieldCollectionData,
  appDataIscedLevelCollectionData,
  appDataLanguageCollectionData,
  appDataLicenseCollectionData,
  appDataResourceTypeCollectionData,
  appDataUserSpaceCollectionData,
  databaseConnections,
} from './types'
import { activeAuthSessionData, staticData } from './types/collections'

export function getDbStruct(databaseConnections: databaseConnections) {
  // console.log({ databaseConnections })
  const baseConnectionConfig = {
    keepalive: true,
    retryOnConflict: 5,
  }
  const appData_db = new Database({ ...baseConnectionConfig, ...databaseConnections.appData })
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
        eduIscedField: appData_db.collection<appDataIscedFieldCollectionData>('eduIscedField'),
        eduIscedLevel: appData_db.collection<appDataIscedLevelCollectionData>('eduIscedLevel'),
        eduBloomCognitive: appData_db.collection<appDataBloomCognitiveCollectionData>('eduBloomCognitive'),
        eduResourceType: appData_db.collection<appDataResourceTypeCollectionData>('eduResourceType'),
        contentLanguage: appData_db.collection<appDataLanguageCollectionData>('contentLanguage'),
        contentLicense: appData_db.collection<appDataLicenseCollectionData>('contentLicense'),
        userSpace: appData_db.collection<appDataUserSpaceCollectionData>('userSpace'),
        staticData: appData_db.collection<staticData>('staticData'),
      },
    },
    services: {
      db: services_db,
      coll: {
        dbUpgrade: services_db.collection<dbUpgradeData>('dbUpgrade'),
        modelUpgrade: services_db.collection<{ data: statics.modelUpgradeData }>('modelUpgrade'),
        modelEnvelopeQueue: services_db.collection<job<{ envelope: moo.model.envelope<any_> }>>('modelEnvelopeQueue'),
        activeAuthSession: services_db.collection<activeAuthSessionData>('activeAuthSession'),
      },
    },
  }
}
