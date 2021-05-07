import { _ctx, _node } from '@moodlenet/common/lib/assertions'
import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { AssertionOf } from '@moodlenet/common/lib/utils/op-chain'
import { DocumentNodeByType } from '../../adapters/content-graph/arangodb/functions/types'
import { assertCtx } from '../../adapters/executionContext/assertCtx'
import { MoodleNetExecutionContext } from '../../graphql'
import { QMModule, QMQuery } from '../../lib/qmino/root'

export type GetNodeAdapter<Type extends GQL.NodeType> = (_: {
  nodeType: Type
  _key: IdKey
  assertions: {
    node: AssertionOf<typeof _node>
  }
}) => Promise<DocumentNodeByType<Type> | null>
export const getContentNodeById = QMQuery(
  <Type extends GQL.NodeType = GQL.NodeType>({
    _key,
    ctx,
    nodeType,
  }: {
    _key: IdKey
    nodeType: Type
    ctx: MoodleNetExecutionContext
  }) => async (adapter: GetNodeAdapter<Type>): Promise<DocumentNodeByType<Type> | null> => {
    if (!assertCtx(ctx, _ctx.ExecutorIsAuthenticated.AND.ExecutorIsAuthenticated)) {
      return null
    }
    const nodeAssertion = _node.ThisNodeIsExecutorProfile
    return adapter({ _key, assertions: { node: nodeAssertion }, nodeType })
  },
)

QMModule(module)
