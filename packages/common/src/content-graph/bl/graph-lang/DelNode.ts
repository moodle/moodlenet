import { Assumptions, BaseOperators } from '.'
import { NodeType } from '../../../graphql/types.graphql.gen'
import { SessionEnv } from '../../../types'
import { GraphNodeIdentifier } from '../../types/node'
import { GraphOperators } from './graphOperators'

export type DelNodeAssumptionsFactory = (_: {
  nodeIdentifier: GraphNodeIdentifier
  env: SessionEnv
  graphOperators: GraphOperators
  baseOperators: BaseOperators
}) => Promise<Assumptions>

export type DelNodeAssumptionsFactoryMap = Partial<Record<`${NodeType}`, DelNodeAssumptionsFactory>>

export const getDelNodeAssumptions = async ({
  env,
  map,
  nodeIdentifier,
  baseOperators,
  graphOperators,
}: {
  nodeIdentifier: GraphNodeIdentifier
  env: SessionEnv
  map: DelNodeAssumptionsFactoryMap
  graphOperators: GraphOperators
  baseOperators: BaseOperators
}) => {
  const assuptionsFactory = map[`${nodeIdentifier._type}`]
  if (!assuptionsFactory) {
    return undefined
  }
  return assuptionsFactory({ env, nodeIdentifier, baseOperators, graphOperators })
}
