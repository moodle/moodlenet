import { Assumptions, BaseOperators, BV } from '.'
import { NodeType } from '../../../graphql/types.graphql.gen'
import { SessionEnv } from '../../../types'
import { GraphNode, GraphNodeIdentifier } from '../../types/node'
import { GraphOperators } from './graphOperators'

export type EditNodeOperators = {
  node: BV<GraphNode | null>
  // issuerNode: BV<GraphNode | null>
}
export type EditNodeAssumptionsFactoryOps = {
  nodeIdentifier: GraphNodeIdentifier
  sessionEnv: SessionEnv
  graphOperators: GraphOperators
  baseOperators: BaseOperators
  editNodeOperators: EditNodeOperators
}
export type EditNodeAssumptionsFactory = (_: EditNodeAssumptionsFactoryOps) => Promise<Assumptions>

export type EditNodeAssumptionsFactoryMap = Partial<Record<NodeType, EditNodeAssumptionsFactory>>

export const getEditNodeAssumptions = async ({
  sessionEnv,
  map,
  nodeIdentifier,
  baseOperators,
  graphOperators,
  editNodeOperators,
}: {
  nodeIdentifier: GraphNodeIdentifier
  sessionEnv: SessionEnv
  map: EditNodeAssumptionsFactoryMap
  graphOperators: GraphOperators
  baseOperators: BaseOperators
  editNodeOperators: EditNodeOperators
}) => {
  const assuptionsFactory = map[`${nodeIdentifier._type}`]
  if (!assuptionsFactory) {
    return undefined
  }
  return assuptionsFactory({ sessionEnv, nodeIdentifier, baseOperators, graphOperators, editNodeOperators })
}
