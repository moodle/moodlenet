import { GraphQLApi } from '../../MoodleNetGraphQL'
import { UserCreateForNewAccountApiHandler } from './apis/ContentGraph.User.CreateForNewAccount.api'
import { NodeByIdApiHandler } from './apis/ContentGraph.Node.ById'
import { CreateNodeHandler } from './apis/ContentGraph.Node.Create'
import { CreateEdgeHandler } from './apis/ContentGraph.Edge.Create'

export type ContentGraph = {
  GQL: GraphQLApi
  User: {
    CreateForNewAccount: typeof UserCreateForNewAccountApiHandler
  }
  Node: {
    ById: typeof NodeByIdApiHandler
    Create: typeof CreateNodeHandler
  }
  Edge: {
    Create: typeof CreateEdgeHandler
  }
}
