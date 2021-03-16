import { Config } from 'arangojs/connection'
import { Teardown } from '../../../../../lib/domain/types'
import { createDatabaseIfNotExists, createVertexCollectionIfNotExists } from '../../../../../lib/helpers/arango'
import { Persistence, UserAuthConfig, UserRecord } from './types'

export const getPersistence = async ({
  cfg,
  databaseName,
}: {
  cfg: Config
  databaseName: string
}): Promise<[Persistence, Teardown]> => {
  const db = await createDatabaseIfNotExists({ dbConfig: cfg, dbCreateOpts: {}, name: databaseName })

  const User = await createVertexCollectionIfNotExists<UserRecord>({
    name: 'User',
    database: db,
    createOpts: {},
  })

  const Config = await createVertexCollectionIfNotExists<UserAuthConfig>({
    name: 'Config',
    database: db,
    createOpts: {},
  })

  return [
    {
      User: User,
      Config,
      db,
    },
    () => db.close(),
  ]
}
