import { Assumptions, BaseOperators } from '.'
import { SessionEnv } from '../../../types'
import { GraphNodeIdentifier, GraphNodeType } from '../../types/node'
import { GraphOperators } from './graphOperators'

export type DelNodeAssumptionsFactory = (_: {
  nodeIdentifier: GraphNodeIdentifier
  sessionEnv: SessionEnv
  graphOperators: GraphOperators
  baseOperators: BaseOperators
}) => Promise<Assumptions>

export type DelNodeAssumptionsFactoryMap = Partial<Record<`${GraphNodeType}`, DelNodeAssumptionsFactory>>

export const getDelNodeAssumptions = async ({
  sessionEnv,
  map,
  nodeIdentifier,
  baseOperators,
  graphOperators,
}: {
  nodeIdentifier: GraphNodeIdentifier
  sessionEnv: SessionEnv
  map: DelNodeAssumptionsFactoryMap
  graphOperators: GraphOperators
  baseOperators: BaseOperators
}) => {
  const assuptionsFactory = map[`${nodeIdentifier._type}`]
  if (!assuptionsFactory) {
    return undefined
  }
  return assuptionsFactory({ sessionEnv, nodeIdentifier, baseOperators, graphOperators })
}
