import { Config } from 'arangojs/connection'
import { Teardown } from '../../../../../lib/domain/types'
import { createDatabaseIfNotExists, createVertexCollectionIfNotExists } from '../../../../../lib/helpers/arango'
import { Persistence, UserAccountConfig, UserAccountRecord } from './types'

export const getPersistence = async ({
  cfg,
  databaseName,
}: {
  cfg: Config
  databaseName: string
}): Promise<[Persistence, Teardown]> => {
  const db = await createDatabaseIfNotExists({ dbConfig: cfg, dbCreateOpts: {}, name: databaseName })

  const UserAccount = await createVertexCollectionIfNotExists<UserAccountRecord>({
    name: 'UserAccount',
    database: db,
    createOpts: {},
  })

  const Config = await createVertexCollectionIfNotExists<UserAccountConfig>({
    name: 'Config',
    database: db,
    createOpts: {},
  })

  return [
    {
      UserAccount,
      Config,
      db,
    },
    () => db.close(),
  ]
}
