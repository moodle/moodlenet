export * from './types'

import { EdgeType, NodeType } from '../pub-graphql/types.graphql.gen'
import { EdgeOp, GraphDef, NodeOp } from './types'

type EdgeDefType = EdgeType
export const getEdgeDef = ({ graph, edge }: { graph: GraphDef; edge: EdgeDefType }) => graph.edges[edge]

export const getEdgeDefForNodes = ({
  graph,
  from,
  to,
  edge,
}: {
  graph: GraphDef
  edge: EdgeDefType
  from: NodeType
  to: NodeType
}) => {
  const edgeDef = getEdgeDef({ graph, edge })
  const [fromTypes, toTypes] = edgeDef
  if (!(fromTypes.includes(from) && toTypes.includes(to))) {
    return null
  }
  return edgeDef
}

export const getEdgeOpAssertionsMap = ({
  graph,
  from,
  to,
  edge,
}: {
  graph: GraphDef
  edge: EdgeDefType
  from: NodeType
  to: NodeType
}) => {
  const edgeDef = getEdgeDefForNodes({ graph, from, to, edge })
  if (!edgeDef) {
    return null
  }
  const [, , opMap] = edgeDef
  return opMap
}

export const getEdgeOpAssertions = ({
  graph,
  from,
  to,
  edge,
  op,
}: {
  graph: GraphDef
  edge: EdgeDefType
  from: NodeType
  to: NodeType
  op: EdgeOp
}) => {
  const opMap = getEdgeOpAssertionsMap({ graph, from, to, edge })
  if (!opMap) {
    return null
  }
  return opMap[op]
}

export const getNodeOpAssertionsMap = ({ graph, nodeType }: { graph: GraphDef; nodeType: NodeType }) =>
  graph.nodes[nodeType]

export const getNodeOpAssertions = ({ graph, nodeType, op }: { graph: GraphDef; nodeType: NodeType; op: NodeOp }) =>
  getNodeOpAssertionsMap({ graph, nodeType })[op]
