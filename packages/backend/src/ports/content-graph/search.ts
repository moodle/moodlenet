import { GlobalSearchNodeType, GlobalSearchSort } from '@moodlenet/common/lib/content-graph/types/global-search'
import { GraphNode } from '@moodlenet/common/lib/content-graph/types/node'
import { Page, PaginationInput } from '@moodlenet/common/lib/content-graph/types/page'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { SessionEnv } from '../../lib/auth/types'
import { QMModule, QMQuery } from '../../lib/qmino'

export type Adapter = {
  searchNodes: <NodeType extends GlobalSearchNodeType>(_: GlobalSearchInput<NodeType>) => Promise<SearchPage>
}

export type SearchPage = Page<GraphNode<GlobalSearchNodeType>>
export type GlobalSearchInput<NodeType extends GlobalSearchNodeType = GlobalSearchNodeType> = {
  sort: Maybe<GlobalSearchSort>
  text: string
  nodeTypes: Maybe<NodeType[]>
  page: PaginationInput
  env: SessionEnv | null
}
export const byTerm = QMQuery(
  <NodeType extends GlobalSearchNodeType>({ sort, text, nodeTypes, page, env }: GlobalSearchInput<NodeType>) =>
    async ({ searchNodes }: Adapter) => {
      // console.log({ nodeTypes, page, sort, text })
      return searchNodes({ sort, text, nodeTypes, page, env })
    },
)

QMModule(module)
