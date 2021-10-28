import { Assumptions, BaseOperators } from '.'
import { SessionEnv } from '../../../types'
import { GraphEdgeIdentifier, GraphEdgeType } from '../../types/edge'
import { GraphNodeIdentifier, GraphNodeType } from '../../types/node'
import { GraphOperators } from './graphOperators'

export type DelEdgeAssumptionsFactory = (_: {
  from: GraphNodeIdentifier
  edge: GraphEdgeIdentifier
  to: GraphNodeIdentifier
  sessionEnv: SessionEnv
  graphOperators: GraphOperators
  baseOperators: BaseOperators
}) => Promise<Assumptions>

export type DelEdgeAssumptionsFactoryMap = Partial<
  Record<`${GraphNodeType}_${GraphEdgeType}_${GraphNodeType}`, DelEdgeAssumptionsFactory>
>

export const getDelEdgeAssumptions = async ({
  edge,
  sessionEnv,
  from,
  map,
  to,
  baseOperators,
  graphOperators,
}: {
  from: GraphNodeIdentifier
  edge: GraphEdgeIdentifier
  to: GraphNodeIdentifier
  sessionEnv: SessionEnv
  map: DelEdgeAssumptionsFactoryMap
  graphOperators: GraphOperators
  baseOperators: BaseOperators
}) => {
  const assuptionsFactory = map[`${from._type}_${edge._type}_${to._type}`]
  if (!assuptionsFactory) {
    return undefined
  }
  return assuptionsFactory({ sessionEnv, from, edge, to, baseOperators, graphOperators })
}
