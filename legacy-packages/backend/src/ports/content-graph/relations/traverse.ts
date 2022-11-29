import { GraphEdge, GraphEdgeType } from '@moodlenet/common/dist/content-graph/types/edge'
import { GraphNode, GraphNodeIdentifier, GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { NodeTraversalPage, PaginationInput } from '@moodlenet/common/dist/content-graph/types/page'
import { SessionEnv } from '@moodlenet/common/dist/types'
import { Maybe } from '@moodlenet/common/dist/utils/types'
import { ns } from '../../../lib/ns/namespace'
import { plug, value } from '../../../lib/plug'
import { Assertions, BV } from '../graph-lang/base'
import { graphOperators } from '../graph-lang/graph'

export type Operators = {
  traverseNode: BV<GraphNode>
  traverseEdge: BV<GraphEdge>
}
export const operators = value<Operators>(ns(module, 'operators'))

export const bRules = plug<BRules>(ns(module, 'b-rules'))
export type BRules = (_: Input & { arg: Omit<AdapterArg, 'assertions'> }) => Promise<AdapterArg | null>

export type AdapterArg = {
  fromNode: BV<GraphNode>
  edgeType: GraphEdgeType
  targetNodeTypes: Maybe<GraphNodeType[]>
  targetIds: Maybe<BV<GraphNode>[]>
  inverse: boolean
  page: PaginationInput
  assertions: Assertions
}
export const adapter = plug<(_: AdapterArg) => Promise<NodeTraversalPage>>(ns(module, 'adapter'))

export type Input = {
  fromNode: GraphNodeIdentifier
  edgeType: GraphEdgeType
  targetNodeTypes: Maybe<GraphNodeType[]>
  targetIds: Maybe<GraphNodeIdentifier[]>
  inverse: boolean
  page: PaginationInput
  sessionEnv: SessionEnv
}

export const port = plug(ns(module, 'port'), async (input: Input) => {
  const { graphNode } = await graphOperators()
  const { edgeType, fromNode, inverse, page, targetIds, targetNodeTypes } = input
  const adapterArg = await bRules({
    ...input,
    arg: {
      edgeType,
      inverse,
      page,
      targetNodeTypes,
      fromNode: graphNode(fromNode),
      targetIds: targetIds?.map(graphNode),
    },
  })
  if (!adapterArg) {
    const emptyNodeTraversalPage: NodeTraversalPage = {
      items: [],
      pageInfo: {
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
      },
    }
    return emptyNodeTraversalPage
  }
  return adapter(adapterArg)
})
