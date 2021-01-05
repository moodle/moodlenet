import * as Yup from 'yup'
import {
  createDatabaseIfNotExists,
  createVertexCollectionIfNotExists,
  createEdgeCollectionIfNotExists,
} from '../../../../../../lib/helpers/arango'
import {} from '../../types'
import { FollowsEdge, SubjectVertex, UserVertex } from '../../glyph'

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

export const database = createDatabaseIfNotExists({
  dbConfig: { url: env.url },
  name: env.databaseName,
  dbCreateOpts: {},
})

export const UserVertices = createVertexCollectionIfNotExists<UserVertex>({
  name: 'User',
  database,
  createOpts: {},
})

export const SubjectVertices = createVertexCollectionIfNotExists<SubjectVertex>(
  {
    name: 'Subject',
    database,
    createOpts: {},
  }
)

export const FollowsEdges = createEdgeCollectionIfNotExists<
  FollowsEdge,
  'Follows'
>({
  name: 'Follows',
  database,
  createOpts: {},
})

export const DBReady = Promise.all([
  database,
  UserVertices,
  SubjectVertices,
  FollowsEdges,
]).then(([db, UserVertices, SubjectVertices, FollowsEdges]) => ({
  db,
  UserVertices,
  SubjectVertices,
  FollowsEdges,
}))
