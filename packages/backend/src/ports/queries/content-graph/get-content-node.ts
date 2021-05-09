import { _ctx, _node } from '@moodlenet/common/lib/assertions/op-chains'
import { assertCtx } from '@moodlenet/common/lib/assertions/static/assertCtx'
import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { IdKey } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { AssertionOf } from '@moodlenet/common/lib/utils/op-chain'
import { DocumentNodeByType } from '../../../adapters/content-graph/arangodb/lib/types'
import { MoodleNetExecutionContext } from '../../../graphql'
import { QMModule, QMQuery } from '../../../lib/qmino'

export type Adapter<Type extends GQL.NodeType> = {
  getNodeById: (_: {
    nodeType: Type
    _key: IdKey
    assertions: AssertionOf<typeof _node>
  }) => Promise<DocumentNodeByType<Type> | null>
}

export type Input<Type extends GQL.NodeType = GQL.NodeType> = {
  _key: IdKey
  nodeType: Type
  ctx: MoodleNetExecutionContext
}

export const byId = QMQuery(
  <Type extends GQL.NodeType = GQL.NodeType>({ _key, ctx, nodeType }: Input<Type>) => async ({
    getNodeById,
  }: Adapter<Type>) => {
    if (!assertCtx(ctx, _ctx.ExecutorIsAnonymous.OR.ExecutorIsAdmin)) {
      return null
    }
    const assertions = _node.ExecutorCreatedThisNode
    return getNodeById({ _key, assertions, nodeType })
  },
)

QMModule(module)
