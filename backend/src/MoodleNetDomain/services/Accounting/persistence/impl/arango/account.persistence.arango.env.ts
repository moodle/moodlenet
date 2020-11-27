import * as Yup from 'yup'

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
