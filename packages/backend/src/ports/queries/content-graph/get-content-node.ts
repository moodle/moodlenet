import { _ctx, _node } from '@moodlenet/common/lib/assertions'
import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { AssertionOf } from '@moodlenet/common/lib/utils/op-chain'
import { DocumentNodeByType } from '../../../adapters/content-graph/arangodb/functions/types'
import { assertCtx } from '../../../adapters/executionContext/assertCtx'
import { MoodleNetExecutionContext } from '../../../graphql'
import { QMModule, QMQuery } from '../../../lib/qmino/root'

export type Adapter<Type extends GQL.NodeType> = {
  getNodeByIdAndAssertions: (_: {
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
    getNodeByIdAndAssertions,
  }: Adapter<Type>) => {
    if (!assertCtx(ctx, _ctx.ExecutorIsAnonymous.AND.ExecutorIsAnonymous)) {
      console.log() //return null
    }
    const assertions = _node.ExecutorCreatedThisNode
    return getNodeByIdAndAssertions({ _key, assertions, nodeType })
  },
)

QMModule(module)
