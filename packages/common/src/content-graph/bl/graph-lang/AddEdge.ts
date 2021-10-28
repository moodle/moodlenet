import { Assumptions, BaseOperators, BV } from '.'
import { SessionEnv } from '../../../types'
import { GraphEdgeType } from '../../types/edge'
import { GraphNode, GraphNodeIdentifier, GraphNodeType } from '../../types/node'
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

export type AddEdgeAssumptionsMap = Partial<
  Record<`${GraphNodeType}_${GraphEdgeType}_${GraphNodeType}`, AddEdgeAssumptionsFactory>
>

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
  edgeType: GraphEdgeType
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
