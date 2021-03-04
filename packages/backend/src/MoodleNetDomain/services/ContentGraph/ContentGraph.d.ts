import { Event } from '../../../lib/domain/event/types'
import { GraphQLApi } from '../../MoodleNetGraphQL'
import { GlyphCreateCounterHandler } from './apis/ContentGraph.Counters.GlyphCreate'
import { CreateEdgeHandler } from './apis/ContentGraph.Edge.Create'
import { NodeByIdApiHandler } from './apis/ContentGraph.Node.ById'
import { CreateNodeHandler } from './apis/ContentGraph.Node.Create'
import { ShallowEdge, ShallowNode } from './persistence/types'

export type ContentGraph = {
  GQL: GraphQLApi
  Node: {
    ById: typeof NodeByIdApiHandler
    Create: typeof CreateNodeHandler
    Created: Event<{ node: ShallowNode }>
  }
  Edge: {
    Create: typeof CreateEdgeHandler
    Created: Event<{ edge: ShallowEdge }>
  }
  Counters: {
    GlyphCreate: typeof GlyphCreateCounterHandler
  }
}
