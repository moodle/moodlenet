import * as Yup from 'yup'
import { createDatabaseIfNotExists } from '../../../../../../lib/helpers/arango'

interface ArangoAccountPersistenceEnv {
  url: string[]
  databaseName: string
}

const Validator = Yup.object<ArangoAccountPersistenceEnv>({
  url: Yup.array(Yup.string().required()).required(),
  databaseName: Yup.string().required(),
})

const ARANGO_URL = process.env.ACCOUNT_ARANGO_URL?.split(';')
const ARANGO_DB = process.env.ACCOUNT_ARANGO_DB

export const env = Validator.validateSync({
  url: ARANGO_URL,
  databaseName: ARANGO_DB,
})!

export const db = createDatabaseIfNotExists({
  dbConfig: { url: env.url },
  name: env.databaseName,
  dbCreateOpts: {},
})
