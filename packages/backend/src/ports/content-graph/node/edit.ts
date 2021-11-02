import { GraphNode, GraphNodeIdentifier, GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/dist/types'
import { DistOmit } from '@moodlenet/common/dist/utils/types'
import { ns } from '../../../lib/ns/namespace'
import { plug, value } from '../../../lib/plug'
import { Assertions, BV } from '../graph-lang/base'

export type Operators = { editNode: BV<GraphNode> }
export const operators = value<Operators>(ns(module, 'operators'))

export const bRules = plug<BRules>(ns(module, 'b-rules'))
export type BRules = (_: Omit<Input, 'data'> & { arg: Omit<AdapterArg, 'assertions'> }) => Promise<AdapterArg | null>

export const adapter = plug<Adapter>(ns(module, 'adapter'))
export type AdapterArg = {
  data: Data
  nodeId: GraphNodeIdentifier
  assertions: Assertions
}
export type Adapter = (_: AdapterArg) => Promise<GraphNode | null>

export type Data<T extends GraphNodeType = GraphNodeType> = Partial<
  DistOmit<GraphNode<T>, '_permId' | '_slug' | '_type' | '_authKey' | '_created' | '_creator'>
> // &Pick<GraphNode, '_type'>
export type Input = {
  data: Data
  nodeId: GraphNodeIdentifier
  sessionEnv: SessionEnv
}
export type Port = (_: Input) => Promise<GraphNode | null>
export const port = plug<Port>(ns(module, 'port'), async ({ data, nodeId, sessionEnv }) => {
  const adapterArg = await bRules({
    sessionEnv,
    nodeId,
    arg: {
      data: { ...data, _edited: sessionEnv.timestamp },
      nodeId,
    },
  })
  if (!adapterArg) {
    return null
  }
  return await adapter(adapterArg)
})
