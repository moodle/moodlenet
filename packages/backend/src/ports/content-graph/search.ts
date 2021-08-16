import { GraphNode } from '@moodlenet/common/lib/content-graph/types/node'
import { Page, PaginationInput } from '@moodlenet/common/lib/content-graph/types/page'
import { GlobalSearchNodeType, GlobalSearchSortBy } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { SessionEnv } from '../../lib/auth/types'
import { QMModule, QMQuery } from '../../lib/qmino'

export type Adapter = {
  searchNodes: <NodeType extends GlobalSearchNodeType>(_: GlobalSearchInput<NodeType>) => Promise<SearchPage>
}

export type GlobalSearchInput<NodeType extends GlobalSearchNodeType> = {
  sortBy: GlobalSearchSortBy
  text: string
  nodeTypes: NodeType[]
  page: PaginationInput
  env: SessionEnv | null
}

export type SearchPage = Page<GraphNode<GlobalSearchNodeType>>

export const byTerm = QMQuery(
  <NodeType extends GlobalSearchNodeType>({ sortBy, text, nodeTypes, page, env }: GlobalSearchInput<NodeType>) =>
    async ({ searchNodes }: Adapter) => {
      return searchNodes({ sortBy, text, nodeTypes, page, env })
    },
)

QMModule(module)
