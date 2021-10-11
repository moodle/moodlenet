import { GlobalSearchNodeType, GlobalSearchSort } from '@moodlenet/common/lib/content-graph/types/global-search'
import { GraphNode } from '@moodlenet/common/lib/content-graph/types/node'
import { Page, PaginationInput } from '@moodlenet/common/lib/content-graph/types/page'
import { SessionEnv } from '@moodlenet/common/lib/types'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { ns } from '../../lib/ns/namespace'
import { plug } from '../../lib/stub/Stub'

export const searchByTermAdapter = plug<
  <NodeType extends GlobalSearchNodeType>(_: GlobalSearchInput<NodeType>) => Promise<SearchPage>
>(ns(__dirname, 'search-by-term-adapter'))

export type SearchPage = Page<GraphNode<GlobalSearchNodeType>>
export type GlobalSearchInput<NodeType extends GlobalSearchNodeType = GlobalSearchNodeType> = {
  sort: Maybe<GlobalSearchSort>
  text: string
  nodeTypes: Maybe<NodeType[]>
  page: PaginationInput
  env: SessionEnv | null
}
export const searchByTerm = plug(
  ns(__dirname, 'search-by-term'),
  async <NodeType extends GlobalSearchNodeType>({ sort, text, nodeTypes, page, env }: GlobalSearchInput<NodeType>) => {
    // console.log({ nodeTypes, page, sort, text })

    return searchByTermAdapter({ sort, text, nodeTypes, page, env })
  },
)
