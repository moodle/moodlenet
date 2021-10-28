import { Assumptions, BaseOperators } from '.'
import { SessionEnv } from '../../../types'
import { DistOmit } from '../../../utils/types'
import { GraphNode, GraphNodeType } from '../../types/node'
import { GraphOperators } from './graphOperators'

export type NewNodeData<N extends GraphNode = GraphNode> = DistOmit<N, '_permId' | '_slug'>
export type AddNodeAssumptionsFactory = (_: {
  newNodeData: NewNodeData
  sessionEnv: SessionEnv
  graphOperators: GraphOperators
  baseOperators: BaseOperators
}) => Promise<Assumptions>

export type AddNodeAssumptionsFactoryMap = Partial<Record<`${GraphNodeType}`, AddNodeAssumptionsFactory>>

export const getAddNodeAssumptions = async ({
  sessionEnv,
  map,
  newNodeData,
  baseOperators,
  graphOperators,
}: {
  newNodeData: NewNodeData
  sessionEnv: SessionEnv
  map: AddNodeAssumptionsFactoryMap
  graphOperators: GraphOperators
  baseOperators: BaseOperators
}) => {
  const assuptionsFactory = map[`${newNodeData._type}`]
  if (!assuptionsFactory) {
    return undefined
  }
  return assuptionsFactory({ sessionEnv, newNodeData, graphOperators, baseOperators })
}
