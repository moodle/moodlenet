import { Database } from 'arangojs'
import { env } from './env.mjs'

export const v2_DB = new Database({ ...env.v2DbConnectionCfg })
export const v2_DB_ContentGraph = new Database({
  ...env.v2DbConnectionCfg,
  databaseName: 'ContentGraph',
})
export const v2_DB_UserAuth = new Database({ ...env.v2DbConnectionCfg, databaseName: 'UserAuth' })
