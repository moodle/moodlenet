import * as Yup from 'yup'
import { createDatabaseIfNotExists, createVertexCollectionIfNotExists } from '../../../../../../lib/helpers/arango'
import { SentEmailDocument } from './types'

interface ArangoEmailPersistenceEnv {
  url: string[]
  databaseName: string
}

const Validator = Yup.object<ArangoEmailPersistenceEnv>({
  url: Yup.array(Yup.string().required()).required(),
  databaseName: Yup.string().required().default('Email'),
})

const ARANGO_URL = process.env.EMAIL_ARANGO_URL?.split(';')
const ARANGO_DB = process.env.EMAIL_ARANGO_DB

export const env = Validator.validateSync({
  url: ARANGO_URL,
  databaseName: ARANGO_DB,
})!

const database = createDatabaseIfNotExists({
  dbConfig: { url: env.url },
  name: env.databaseName,
  dbCreateOpts: {},
})

const SentEmailCollection = createVertexCollectionIfNotExists<SentEmailDocument>({
  name: 'SentEmail',
  database,
  createOpts: {},
})

export const DBReady = Promise.all([database, SentEmailCollection]).then(([db, SentEmail]) => ({
  db,
  SentEmail,
}))
