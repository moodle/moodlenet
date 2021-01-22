import * as Yup from 'yup'
import {
  createDatabaseIfNotExists,
  createEdgeCollectionIfNotExists,
  createVertexCollectionIfNotExists,
} from '../../../../../../lib/helpers/arango'
import {
  EdgeType,
  Follows as FollowsP,
  NodeType,
  Subject as SubjectP,
  User as UserP,
} from '../../../ContentGraph.graphql.gen'
import { edgeConstraints } from '../../graphDefs/edge-constraints'
import { nodeConstraints } from '../../graphDefs/node-constraints'
import { ShallowEdge, ShallowNode } from '../../types'

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

const createGraphNodeCollection = <Type extends NodeType>(nodeType: Type) => {
  const _constraints = nodeConstraints[nodeType]
  return createVertexCollectionIfNotExists<ShallowNode, Type>({
    name: nodeType,
    database,
    createOpts: {},
  })
}
const createGraphEdgeCollection = <Type extends EdgeType>(edgeType: Type) => {
  const _constraints = edgeConstraints[edgeType]
  return createEdgeCollectionIfNotExists<ShallowEdge, Type>({
    name: edgeType,
    database,
    createOpts: {},
  })
}

const UserP = createGraphNodeCollection(NodeType.User)
const SubjectP = createGraphNodeCollection(NodeType.Subject)
const FollowsP = createGraphEdgeCollection<EdgeType.Follows>(EdgeType.Follows)

export const DBReady = Promise.all([database, UserP, SubjectP, FollowsP]).then(
  ([db, User, Subject, Follows]) => ({
    db,
    User,
    Subject,
    Follows,
  })
)
