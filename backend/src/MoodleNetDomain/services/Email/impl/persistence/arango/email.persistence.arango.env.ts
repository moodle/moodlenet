import { Database } from 'arangojs'
import { BasicAuthCredentials, Config } from 'arangojs/connection'
import * as Yup from 'yup'
import { emailLogger } from '../../../email.service.env'

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

const ARANGO_URL = process.env.EMAIL_ARANGO_URL?.split(';')
const ARANGO_DB = process.env.EMAIL_ARANGO_DB
const ARANGO_USERNAME = process.env.EMAIL_ARANGO_USERNAME
const ARANGO_PASSWORD = process.env.EMAIL_ARANGO_PASSWORD

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

export const db = new Database(env.arangoOpts)
export const log = emailLogger('Arango Persistence')
