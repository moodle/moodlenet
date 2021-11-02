import { GraphNode, GraphNodeIdentifier, GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/dist/types'
import { ns } from '../../../lib/ns/namespace'
import { plug, value } from '../../../lib/plug'
import { Assertions, BV } from '../graph-lang/base'
import { graphOperators } from '../graph-lang/graph'

export type Operators = { readNode: BV<GraphNode> }
export const operators = value<Operators>(ns(module, 'operators'))

export const bRules = plug<BRules>(ns(module, 'b-rules'))
export type BRules = <Type extends GraphNodeType>(
  _: Input<Type> & { arg: Omit<AdapterArg, 'assertions'> },
) => Promise<AdapterArg | null>

export const adapter = plug<Adapter>(ns(module, 'adapter'))
export type AdapterArg = {
  nodeId: BV<GraphNode>
  assertions: Assertions
}
export type Adapter = (_: AdapterArg) => Promise<GraphNode | null>

export type Input<Type extends GraphNodeType> = { sessionEnv: SessionEnv; identifier: GraphNodeIdentifier<Type> }
export const port = plug(
  ns(module, 'port'),
  async <Type extends GraphNodeType>({ sessionEnv, identifier }: Input<Type>) => {
    const { graphNode } = await graphOperators()
    const adapterArg = await bRules({ identifier, sessionEnv, arg: { nodeId: graphNode(identifier) } })
    if (!adapterArg) {
      return null
    }
    return adapter(adapterArg)
  },
)
