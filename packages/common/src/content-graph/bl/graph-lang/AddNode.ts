import { Assumptions, BaseOperators } from '.'
import { NodeType } from '../../../graphql/types.graphql.gen'
import { SessionEnv } from '../../../types'
import { DistOmit } from '../../../utils/types'
import { GraphNode } from '../../types/node'
import { GraphOperators } from './graphOperators'

export type NewNodeData<N extends GraphNode = GraphNode> = DistOmit<N, '_permId' | '_slug'>
export type AddNodeAssumptionsFactory = (_: {
  newNodeData: NewNodeData
  env: SessionEnv
  graphOperators: GraphOperators
  baseOperators: BaseOperators
}) => Promise<Assumptions>

export type AddNodeAssumptionsFactoryMap = Partial<Record<`${NodeType}`, AddNodeAssumptionsFactory>>

export const getAddNodeAssumptions = async ({
  env,
  map,
  newNodeData,
  baseOperators,
  graphOperators,
}: {
  newNodeData: NewNodeData
  env: SessionEnv
  map: AddNodeAssumptionsFactoryMap
  graphOperators: GraphOperators
  baseOperators: BaseOperators
}) => {
  const assuptionsFactory = map[`${newNodeData._type}`]
  if (!assuptionsFactory) {
    return undefined
  }
  return assuptionsFactory({ env, newNodeData, graphOperators, baseOperators })
}

// declare const graph: GraphOperators
// declare const base: BaseOperators
// declare const e: Exec
// ;(async () => {
//   const val = base.cmp(5, '!=', 7)
//   const x = await e(val)
//   console.log(x)
// })()
// ;(async () => {
//   const val = base.cond(true, 'a' as const, 'b' as const)
//   const x = await e(val)
//   console.log(x)
// })()
// ;(async () => {
//   const isc = graph.isCreator({ _type: 'Collection', _permId: '' }, { _type: 'Collection', _permId: '' })
//   const _or = base.or(isc, isc, isc, true)
//   const val = graph.isCreator(
//     base.cond(isc, { _type: 'Collection', _permId: '' }, { _type: 'Collection', _permId: '' }),
//     { _type: 'Collection', _permId: '' },
//   )
//   const x = await e(val)
//   console.log(x, _or)
// })()
// ;(async () => {
//   const isc = graph.isCreator({ _type: 'Collection', _permId: '' }, { _type: 'Collection', _permId: '' })
//   const val = base.cond(isc, isc, 'b' as const)
//   const x = await e(val)
//   console.log(x)
// })()
