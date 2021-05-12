import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { MoodleNetExecutionContext } from '../../graphql'
import { QMModule, QMQuery } from '../../lib/qmino'

// FIXME!!!: is it possible to model this to free it from GQL ?
// or shall we go towards naturally implement specific graphql (port|adapter)s ?
// see: packages/backend/src/adapters/content-graph/arangodb/graphql/types.node.ts
// FIXME!!!

export type Adapter = {
  searchNodes: <Type extends GQL.NodeType>(_: {
    sortBy: GQL.GlobalSearchSort
    text: string
    nodeTypes: Maybe<Type[]>
    page: Maybe<GQL.PaginationInput>
    ctx: MoodleNetExecutionContext
    //FIXME: assertions
  }) => Promise<GQL.SearchPage>
}

export type Input<Type extends GQL.NodeType = GQL.NodeType> = {
  sortBy: GQL.GlobalSearchSort
  text: string
  nodeTypes: Maybe<Type[]>
  page: Maybe<GQL.PaginationInput>
  ctx: MoodleNetExecutionContext
}

export const byTerm = QMQuery(
  <Types extends GQL.NodeType = GQL.NodeType>({ sortBy, text, nodeTypes, page, ctx }: Input<Types>) =>
    async ({ searchNodes }: Adapter) => {
      // FIXME: business logic here please
      // e.g.: pagination constraints, and high level validation
      // should happen here, and passed right
      return searchNodes({ sortBy, text, nodeTypes, page, ctx })
    },
)

QMModule(module)
