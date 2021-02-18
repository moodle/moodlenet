import memo from 'lodash/memoize'
import * as Yup from 'yup'
import { createDatabaseIfNotExists } from '../../../../../../lib/helpers/arango'
import { getGraph } from './setupGraph'

interface ArangoContentGraphPersistenceEnv {
  url: string[]
  databaseName: string
}

const Validator = Yup.object<ArangoContentGraphPersistenceEnv>({
  url: Yup.array(Yup.string().required()).required(),
  databaseName: Yup.string().required().default('ContentGraph'),
})

const ARANGO_URL = process.env.CONTENTGRAPH_ARANGO_URL?.split(';')
const ARANGO_DB = process.env.CONTENTGRAPH_ARANGO_DB

export const env = Validator.validateSync({
  url: ARANGO_URL,
  databaseName: ARANGO_DB,
})!

export const getDB = memo(() =>
  createDatabaseIfNotExists({
    dbConfig: { url: env.url },
    name: env.databaseName,
    dbCreateOpts: {},
  }),
)

export const DBReady = memo(async () => {
  const db = await getDB()
  //const graph = await setupGraph({ db })
  const graph = await getGraph({ db })
  return {
    db,
    graph,
  }
})
