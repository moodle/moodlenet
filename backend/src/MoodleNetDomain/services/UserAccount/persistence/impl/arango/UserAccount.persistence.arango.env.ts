import * as Yup from 'yup'
import {
  createDatabaseIfNotExists,
  createVertexCollectionIfNotExists,
} from '../../../../../../lib/helpers/arango'
import { Config, UserAccountRecord } from '../../types'

interface ArangoAccountPersistenceEnv {
  url: string[]
  databaseName: string
}

const Validator = Yup.object<ArangoAccountPersistenceEnv>({
  url: Yup.array(Yup.string().required()).required(),
  databaseName: Yup.string().required().default('Account'),
})

const ARANGO_URL = process.env.ACCOUNT_ARANGO_URL?.split(';')
const ARANGO_DB = process.env.ACCOUNT_ARANGO_DB

export const env = Validator.validateSync({
  url: ARANGO_URL,
  databaseName: ARANGO_DB,
})!

export const database = createDatabaseIfNotExists({
  dbConfig: { url: env.url },
  name: env.databaseName,
  dbCreateOpts: {},
})

export const UserAccountCollection = createVertexCollectionIfNotExists<UserAccountRecord>(
  {
    name: 'UserAccount',
    database,
    createOpts: {},
  }
)

export const ConfigCollection = createVertexCollectionIfNotExists<Config>({
  name: 'Config',
  database,
  createOpts: {},
})

export const DBReady = Promise.all([
  database,
  UserAccountCollection,
  ConfigCollection,
]).then(([db, UserAccount, Config]) => ({
  db,
  UserAccount,
  Config,
}))
