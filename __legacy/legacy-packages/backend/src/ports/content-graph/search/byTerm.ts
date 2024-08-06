import { GlobalSearchNodeType, GlobalSearchSort } from '@moodlenet/common/dist/content-graph/types/global-search'
import { GraphNode } from '@moodlenet/common/dist/content-graph/types/node'
import { Page, PaginationInput } from '@moodlenet/common/dist/content-graph/types/page'
import { SessionEnv } from '@moodlenet/common/dist/types'
import { Maybe } from '@moodlenet/common/dist/utils/types'
import { ns } from '../../../lib/ns/namespace'
import { plug, value } from '../../../lib/plug'
import { Assertions, BV } from '../graph-lang/base'

export type Operators = { searchNode: BV<GraphNode> }
export const operators = value<Operators>(ns(module, 'operators'))

export const bRules = plug<BRules>(ns(module, 'b-rules'))
export type BRules = (_: Input & { arg: Omit<AdapterArg, 'assertions'> }) => Promise<AdapterArg | null>

export type AdapterArg<NodeType extends GlobalSearchNodeType = GlobalSearchNodeType> = Omit<
  Input<NodeType>,
  'sessionEnv'
> & {
  assertions: Assertions
}
export type Adapter = <NodeType extends GlobalSearchNodeType>(_: AdapterArg<NodeType>) => Promise<SearchPage>
export const adapter = plug<Adapter>(ns(module, 'adapter'))

export type SearchPage = Page<GraphNode<GlobalSearchNodeType>>
export type Input<NodeType extends GlobalSearchNodeType = GlobalSearchNodeType> = {
  sort: Maybe<GlobalSearchSort>
  text: string
  nodeTypes: Maybe<NodeType[]>
  page: PaginationInput
  sessionEnv: SessionEnv
  publishedOnly: boolean
}

export const port = plug(ns(module, 'port'), async <NodeType extends GlobalSearchNodeType>(input: Input<NodeType>) => {
  const { nodeTypes, page, sort, text, publishedOnly } = input
  const adapterArg = await bRules({ ...input, arg: { sort, text, nodeTypes, page, publishedOnly } })
  if (!adapterArg) {
    const emptySearhPage: SearchPage = {
      items: [],
      pageInfo: {
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
      },
    }
    return emptySearhPage
  }

  return adapter(adapterArg)
})
