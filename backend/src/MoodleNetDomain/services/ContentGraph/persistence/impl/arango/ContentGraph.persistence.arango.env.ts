import * as Yup from 'yup'
import {
  createDatabaseIfNotExists,
  createEdgeCollectionIfNotExists,
  createVertexCollectionIfNotExists,
} from '../../../../../../lib/helpers/arango'
import {
  CollectionVertex,
  ContainsEdge,
  FollowsEdge,
  LikesEdge,
  ReferencesEdge,
  ResourceVertex,
  SubjectVertex,
  UserVertex,
} from '../../glyph'
import {} from '../../types'

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

export const CollectionVertices = createVertexCollectionIfNotExists<CollectionVertex>(
  {
    name: 'Collection',
    database,
    createOpts: {},
  }
)

export const ResourceVertices = createVertexCollectionIfNotExists<ResourceVertex>(
  {
    name: 'Resource',
    database,
    createOpts: {},
  }
)

export const ContainsEdges = createEdgeCollectionIfNotExists<
  ContainsEdge,
  'Contains'
>({
  name: 'Contains',
  database,
  createOpts: {},
})

export const FollowsEdges = createEdgeCollectionIfNotExists<
  FollowsEdge,
  'Follows'
>({
  name: 'Follows',
  database,
  createOpts: {},
})

export const ReferencesEdges = createEdgeCollectionIfNotExists<
  ReferencesEdge,
  'References'
>({
  name: 'References',
  database,
  createOpts: {},
})

export const LikesEdges = createEdgeCollectionIfNotExists<LikesEdge, 'Likes'>({
  name: 'Likes',
  database,
  createOpts: {},
})

export const DBReady = Promise.all([
  database,
  UserVertices,
  SubjectVertices,
  FollowsEdges,
  CollectionVertices,
  ResourceVertices,
  ContainsEdges,
  LikesEdges,
  ReferencesEdges,
]).then(
  ([
    db,
    UserVertices,
    SubjectVertices,
    FollowsEdges,
    CollectionVertices,
    ResourceVertices,
    ContainsEdges,
    LikesEdges,
    ReferencesEdges,
  ]) => ({
    db,
    UserVertices,
    SubjectVertices,
    FollowsEdges,
    CollectionVertices,
    ResourceVertices,
    ContainsEdges,
    LikesEdges,
    ReferencesEdges,
  })
)
