import { _ctx, _node } from '@moodlenet/common/lib/assertions/op-chains'
import { assertCtx } from '@moodlenet/common/lib/assertions/static/assertCtx'
import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id, IdKey } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { AssertionOf } from '@moodlenet/common/lib/utils/op-chain'
import { DocumentNodeByType, DocumentNodeDataByType } from '../../adapters/content-graph/arangodb/functions/types'
import { MoodleNetExecutionContext } from '../../graphql'
import { getSessionExecutionContext } from '../../lib/auth/types'
import { QMCommand, QMModule, QMQuery } from '../../lib/qmino'

// query by id
export type ByIdAdapter = {
  getNodeById: <Type extends GQL.NodeType>(_: {
    nodeType: Type
    _key: IdKey
    assertions: AssertionOf<typeof _node>
  }) => Promise<DocumentNodeByType<Type> | null>
}

export type ByIdInput<Type extends GQL.NodeType = GQL.NodeType> = {
  _key: IdKey
  nodeType: Type
  ctx: MoodleNetExecutionContext
}

export const byId = QMQuery(
  <Type extends GQL.NodeType = GQL.NodeType>({ _key, ctx, nodeType }: ByIdInput<Type>) =>
    async ({ getNodeById }: ByIdAdapter) => {
      if (!assertCtx(ctx, _ctx.ExecutorIsAnonymous.OR.ExecutorIsAuthenticated)) {
        return null
      }
      const assertions = _node.ExecutorCreatedThisNode
      return getNodeById({ _key, assertions, nodeType })
    },
)

// create

export type CreateAdapter = {
  storeNode: <Type extends GQL.NodeType>(_: {
    nodeType: Type
    key?: IdKey
    data: DocumentNodeDataByType<Type>
    creatorProfileId: Id
    assertions: null | AssertionOf<typeof _node>
  }) => Promise<DocumentNodeByType<Type> | null>
}

export type CreateInput<Type extends GQL.NodeType = GQL.NodeType> = {
  ctx: MoodleNetExecutionContext
  key?: IdKey // remove this .. it was only necessary for profile creation on accuont activation, change the flow and disjoint the two
  nodeType: Type
  data: DocumentNodeDataByType<Type>
}

export const create = QMCommand(
  <Type extends GQL.NodeType = GQL.NodeType>({ data, key, ctx, nodeType }: CreateInput<Type>) =>
    async ({ storeNode }: CreateAdapter): Promise<DocumentNodeByType<Type> | GQL.CreateNodeMutationErrorType> => {
      const sessionCtx = getSessionExecutionContext(ctx)

      if (!(sessionCtx && assertCtx(ctx, _ctx.ExecutorIsAuthenticated.OR.ExecutorIsSystem))) {
        return 'NotAuthorized'
      }
      const creatorProfileId = sessionCtx.profileId
      const assertions = null //_node.ExecutorCreatedThisNode
      const result = await storeNode({ key, assertions, nodeType, data, creatorProfileId })
      if (!result) {
        return 'AssertionFailed'
      }
      return result
    },
)

QMModule(module)
