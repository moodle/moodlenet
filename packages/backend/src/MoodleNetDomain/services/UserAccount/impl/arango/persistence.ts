import { Database } from 'arangojs'
import { Config } from 'arangojs/connection'
import { Teardown } from '../../../../../lib/domain/types'
import { createVertexCollectionIfNotExists } from '../../../../../lib/helpers/arango'
import { Persistence, UserAccountConfig, UserAccountRecord } from './types'

export const getPersistence = async ({ cfg }: { cfg: Config }): Promise<[Persistence, Teardown]> => {
  const db = new Database(cfg)

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
