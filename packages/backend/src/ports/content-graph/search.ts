import { BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { GlobalSearchNodeType, GlobalSearchSort } from '@moodlenet/common/lib/content-graph/types/global-search'
import { GraphNode } from '@moodlenet/common/lib/content-graph/types/node'
import { Page, PaginationInput } from '@moodlenet/common/lib/content-graph/types/page'
import { SessionEnv } from '@moodlenet/common/lib/types'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { ns } from '../../lib/ns/namespace'
import { plug } from '../../lib/plug'
import { getGraphOperatorsAdapter } from './common'

export type GlobalSearchInputAdapterArg<NodeType extends GlobalSearchNodeType = GlobalSearchNodeType> = {
  issuerNode: BV<GraphNode | null>
} & Omit<GlobalSearchInput<NodeType>, 'env'>

export const searchByTermAdapter = plug<
  <NodeType extends GlobalSearchNodeType>(_: GlobalSearchInputAdapterArg<NodeType>) => Promise<SearchPage>
>(ns(__dirname, 'search-by-term-adapter'))

export type SearchPage = Page<GraphNode<GlobalSearchNodeType>>
export type GlobalSearchInput<NodeType extends GlobalSearchNodeType = GlobalSearchNodeType> = {
  sort: Maybe<GlobalSearchSort>
  text: string
  nodeTypes: Maybe<NodeType[]>
  page: PaginationInput
  env: SessionEnv
}
export const searchByTerm = plug(
  ns(__dirname, 'search-by-term'),
  async <NodeType extends GlobalSearchNodeType>({ sort, text, nodeTypes, page, env }: GlobalSearchInput<NodeType>) => {
    //  console.log({ nodeTypes, page, sort, text })
    const { graphNode } = await getGraphOperatorsAdapter()

    const issuerNode = graphNode(env.authId)
    return searchByTermAdapter({ sort, text, nodeTypes, page, issuerNode })
  },
)
