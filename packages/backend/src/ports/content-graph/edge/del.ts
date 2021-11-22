import { GraphEdge, GraphEdgeIdentifier } from '@moodlenet/common/dist/content-graph/types/edge'
import { GraphNode } from '@moodlenet/common/dist/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/dist/types'
import { ns } from '../../../lib/ns/namespace'
import { plug, value } from '../../../lib/plug'
import { Assertions, BV } from '../graph-lang/base'

export const operators = value<Operators>(ns(module, 'operators'))
export type Operators = {
  fromNode: BV<GraphNode>
  toNode: BV<GraphNode>
  delEdge: BV<GraphEdge>
}

export type BRules = (_: Input & { arg: Omit<AdapterArg, 'assertions'> }) => Promise<AdapterArg | null>
export const bRules = plug<BRules>(ns(module, 'b-rules'))

export type AdapterArg = { edgeId: GraphEdgeIdentifier; assertions: Assertions }
export type Adapter = (_: AdapterArg) => Promise<boolean>
export const adapter = plug<Adapter>(ns(module, 'adapter'))

export type Input = {
  sessionEnv: SessionEnv
  edgeId: GraphEdgeIdentifier
}
export type Port = (_: Input) => Promise<boolean>
export const port = plug<Port>(ns(module, 'port'), async ({ edgeId, sessionEnv }) => {
  const adapterArg = await bRules({ edgeId, sessionEnv, arg: { edgeId } })
  if (!adapterArg) {
    return false
  }

  const result = await adapter(adapterArg)
  return result
})
