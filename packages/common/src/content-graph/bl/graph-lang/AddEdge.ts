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
export type AddEdgeAssumptionsFactory = (_: {
  from: GraphNodeIdentifier
  to: GraphNodeIdentifier
  env: SessionEnv
  graphOperators: GraphOperators
  baseOperators: BaseOperators
  addEdgeOperators: AddEdgeOperators
}) => Promise<Assumptions>

export type AddEdgeAssumptionsMap = Partial<Record<`${NodeType}_${EdgeType}_${NodeType}`, AddEdgeAssumptionsFactory>>

export const getAddEdgeAssumptions = async ({
  edgeType,
  env,
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
  env: SessionEnv
  map: AddEdgeAssumptionsMap
  graphOperators: GraphOperators
  baseOperators: BaseOperators
  addEdgeOperators: AddEdgeOperators
}) => {
  const assuptionsFactory = map[`${from._type}_${edgeType}_${to._type}`]
  if (!assuptionsFactory) {
    return undefined
  }
  return assuptionsFactory({ env, from, to, graphOperators, baseOperators, addEdgeOperators })
}
