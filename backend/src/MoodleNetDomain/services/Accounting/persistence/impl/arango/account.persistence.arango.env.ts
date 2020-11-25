import { Database } from 'arangojs'
import { BasicAuthCredentials, Config } from 'arangojs/connection'
import * as Yup from 'yup'
import { accountingLogger } from '../../../accounting.env'

type ArangoOptsEnv = Pick<Config, 'url' | 'databaseName' | 'auth'>

interface ArangoDomainPersistenceEnv {
  arangoOpts: ArangoOptsEnv
}

const Validator = Yup.object<ArangoDomainPersistenceEnv>({
  arangoOpts: Yup.object<ArangoOptsEnv>({
    url: Yup.array(Yup.string().required()),
    databaseName: Yup.string().required(),
    auth: Yup.object<BasicAuthCredentials>({
      username: Yup.string(),
      password: Yup.string(),
    }),
  }).required(),
})

const ARANGO_URL = process.env.ACCOUNT_ARANGO_URL?.split(';')
const ARANGO_DB = process.env.ACCOUNT_ARANGO_DB
const ARANGO_USERNAME = process.env.ACCOUNT_ARANGO_USERNAME
const ARANGO_PASSWORD = process.env.ACCOUNT_ARANGO_PASSWORD

export const env = Validator.validateSync({
  arangoOpts: {
    url: ARANGO_URL,
    databaseName: ARANGO_DB,
    auth: {
      username: ARANGO_USERNAME,
      password: ARANGO_PASSWORD,
    },
  },
})!
console.table(env)
export const db = new Database(env.arangoOpts)
export const log = accountingLogger('Arango Persistence')
