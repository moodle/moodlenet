import { GraphQLApi } from '../../MoodleNetGraphQL'
import { CreateEdgeHandler } from './apis/ContentGraph.Edge.Create'
import { NodeByIdApiHandler } from './apis/ContentGraph.Node.ById'
import { CreateNodeHandler } from './apis/ContentGraph.Node.Create'

export type ContentGraph = {
  GQL: GraphQLApi
  Node: {
    ById: typeof NodeByIdApiHandler
    Create: typeof CreateNodeHandler
  }
  Edge: {
    Create: typeof CreateEdgeHandler
  }
}
