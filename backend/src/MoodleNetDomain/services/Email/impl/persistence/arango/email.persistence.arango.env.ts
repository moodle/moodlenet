import * as Yup from 'yup'
import { createDatabaseIfNotExists } from '../../../../../../lib/helpers/arango'

interface ArangoEmailPersistenceEnv {
  url: string[]
  databaseName: string
}

const Validator = Yup.object<ArangoEmailPersistenceEnv>({
  url: Yup.array(Yup.string().required()).required(),
  databaseName: Yup.string().required(),
})

const ARANGO_URL = process.env.EMAIL_ARANGO_URL?.split(';')
const ARANGO_DB = process.env.EMAIL_ARANGO_DB

export const env = Validator.validateSync({
  url: ARANGO_URL,
  databaseName: ARANGO_DB,
})!

export const db = createDatabaseIfNotExists({
  dbConfig: { url: env.url },
  name: env.databaseName,
  dbCreateOpts: {},
})
