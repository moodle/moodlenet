import { Config } from 'arangojs/connection'
import { Teardown } from '../../../../../lib/domain/types'
import { createDatabaseIfNotExists, createVertexCollectionIfNotExists } from '../../../../../lib/helpers/arango'
import { Persistence, SentEmailDocument } from './types'

export const getPersistence = async ({
  cfg,
  databaseName,
}: {
  cfg: Config
  databaseName: string
}): Promise<[Persistence, Teardown]> => {
  const db = await createDatabaseIfNotExists({ dbConfig: cfg, dbCreateOpts: {}, name: databaseName })

  const SentEmailCollection = await createVertexCollectionIfNotExists<SentEmailDocument>({
    name: 'SentEmail',
    database: db,
    createOpts: {},
  })
  return [
    {
      SentEmailCollection,
      db,
    },
    () => db.close(),
  ]
}
