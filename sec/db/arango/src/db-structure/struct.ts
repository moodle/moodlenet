import { modConfigName, ModConfigs } from '@moodle/domain'
import { Database } from 'arangojs'
import { userAccountDocument } from '../sec/db-arango-user-account-lib/types'
import { userProfileDocument } from '../sec/db-arango-user-profile-lib/types'
import { database_connections } from './types'

export function getDbStruct(database_connections: database_connections) {
  const baseConnectionConfig = {
    keepalive: true,
    retryOnConflict: 5,
  }
  const data_db = new Database({ ...baseConnectionConfig, ...database_connections.data })
  const user_account_db = new Database({ ...baseConnectionConfig, ...database_connections.userAccount })
  const mng_db = new Database({ ...baseConnectionConfig, ...database_connections.mng })
  const sys_db = new Database({
    ...baseConnectionConfig,
    ...database_connections.mng,
    databaseName: '_system',
  })

  return {
    connections: database_connections,
    sys_db,
    mng: {
      db: mng_db,
      coll: {
        module_configs: mng_db.collection<ModConfigs[modConfigName]>('module_configs'),
        migrations: mng_db.collection('migrations'),
      },
    },
    data: {
      db: data_db,
      coll: {
        userProfile: data_db.collection<userProfileDocument>('userProfile'),
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
