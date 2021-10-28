import { Assumptions, BaseOperators, BV } from '.'
import { EdgeType, NodeType } from '../../../graphql/types.graphql.gen'
import { SessionEnv } from '../../../types'
import { GraphNode, GraphNodeIdentifier } from '../../types/node'
import { GraphOperators } from './graphOperators'

export type AddEdgeOperators = {
  issuerNode: BV<GraphNode | null>
  fromNode: BV<GraphNode | null>
  toNode: BV<GraphNode | null>
}
export type AddEdgeAssumptionsFactoryOps = {
  from: GraphNodeIdentifier
  to: GraphNodeIdentifier
  sessionEnv: SessionEnv
  graphOperators: GraphOperators
  baseOperators: BaseOperators
  addEdgeOperators: AddEdgeOperators
}
export type AddEdgeAssumptionsFactory = (_: AddEdgeAssumptionsFactoryOps) => Promise<Assumptions>

export type AddEdgeAssumptionsMap = Partial<Record<`${NodeType}_${EdgeType}_${NodeType}`, AddEdgeAssumptionsFactory>>

export const getAddEdgeAssumptions = async ({
  edgeType,
  sessionEnv,
  from,
  map,
  to,
  graphOperators,
  baseOperators,
  addEdgeOperators,
}: {
  from: GraphNodeIdentifier
  edgeType: EdgeType
  to: GraphNodeIdentifier
  sessionEnv: SessionEnv
  map: AddEdgeAssumptionsMap
  graphOperators: GraphOperators
  baseOperators: BaseOperators
  addEdgeOperators: AddEdgeOperators
}) => {
  const assuptionsFactory = map[`${from._type}_${edgeType}_${to._type}`]
  if (!assuptionsFactory) {
    return undefined
  }
  return assuptionsFactory({ sessionEnv, from, to, graphOperators, baseOperators, addEdgeOperators })
}
