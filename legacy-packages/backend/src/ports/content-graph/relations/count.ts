import { GraphEdge, GraphEdgeType } from '@moodlenet/common/dist/content-graph/types/edge'
import { GraphNode, GraphNodeIdentifier, GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/dist/types'
import { Maybe } from '@moodlenet/common/dist/utils/types'
import { arangoGraphOperators } from '../../../adapters/content-graph/arangodb/adapters/bl/graphOperators'
import { ns } from '../../../lib/ns/namespace'
import { plug, value } from '../../../lib/plug'
import { Assertions, BV } from '../graph-lang/base'

//

export type Operators = { countingNode: BV<GraphNode>; parentNode: BV<GraphNode>; countingEdge: BV<GraphEdge> }
export const operators = value<Operators>(ns(module, 'operators'))

export const bRules = plug<BRules>(ns(module, 'b-rules'))
export type BRules = (_: Input & { arg: Omit<AdapterArg, 'assertions'> }) => Promise<AdapterArg | null>

export const adapter = plug<(_: AdapterArg) => Promise<number>>(ns(module, 'adapter'))

export type AdapterArg = {
  fromNode: BV<GraphNode>
  edgeType: GraphEdgeType
  targetNodeTypes: Maybe<GraphNodeType[]>
  inverse: boolean
  assertions: Assertions
}

export type Input = {
  fromNode: GraphNodeIdentifier
  edgeType: GraphEdgeType
  targetNodeTypes: Maybe<GraphNodeType[]>
  inverse: boolean
  sessionEnv: SessionEnv
}

export const port = plug(ns(module, 'port'), async (input: Input) => {
  const { graphNode } = await arangoGraphOperators()
  const adapterArg = await bRules({ ...input, arg: { ...input, fromNode: graphNode(input.fromNode) } })
  if (!adapterArg) {
    return 0
  }
  return adapter(adapterArg)
})
