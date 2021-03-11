import { Database } from 'arangojs'
import { Config } from 'arangojs/connection'
import { Teardown } from '../../../../../lib/domain/types'
import { createVertexCollectionIfNotExists } from '../../../../../lib/helpers/arango'
import { Persistence, SentEmailDocument } from './types'

export const getPersistence = async ({ cfg }: { cfg: Config }): Promise<[Persistence, Teardown]> => {
  const db = new Database(cfg)

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
