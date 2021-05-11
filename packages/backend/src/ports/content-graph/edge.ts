import { _conn, _ctx } from '@moodlenet/common/lib/assertions/op-chains'
import { assertCtx } from '@moodlenet/common/lib/assertions/static/assertCtx'
import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { AssertionOf } from '@moodlenet/common/lib/utils/op-chain'
import { DocumentEdgeByType, DocumentEdgeDataByType } from '../../adapters/content-graph/arangodb/functions/types'
import { MoodleNetExecutionContext } from '../../graphql'
import { getSessionExecutionContext } from '../../lib/auth/types'
import { QMModule, QMMutation } from '../../lib/qmino'

// create

export type CreateAdapter = {
  storeEdge: <Type extends GQL.EdgeType>(_: {
    edgeType: Type
    data: DocumentEdgeDataByType<Type>
    from: Id
    to: Id
    creatorProfileId: Id
    assertions: null | AssertionOf<typeof _conn>
  }) => Promise<DocumentEdgeByType<Type> | null>
}

export type CreateInput<Type extends GQL.EdgeType = GQL.EdgeType> = {
  ctx: MoodleNetExecutionContext
  from: Id
  to: Id
  edgeType: Type
  data: DocumentEdgeDataByType<Type>
}

export const create = QMMutation(
  <Type extends GQL.EdgeType = GQL.EdgeType>({ data, ctx, edgeType, from, to }: CreateInput<Type>) =>
    async ({ storeEdge }: CreateAdapter): Promise<DocumentEdgeByType<Type> | GQL.CreateEdgeMutationErrorType> => {
      const sessionCtx = getSessionExecutionContext(ctx)

      if (!(sessionCtx && assertCtx(ctx, _ctx.ExecutorIsAuthenticated))) {
        return 'NotAuthorized'
      }
      const creatorProfileId = sessionCtx.profileId
      const assertions = null //_conn.ExecutorCreatedThisEdge
      const result = await storeEdge({ from, to, assertions, edgeType, data, creatorProfileId })
      if (!result) {
        return 'AssertionFailed'
      }
      return result
    },
)

// delete

export type DeleteAdapter = {
  deleteEdge: <Type extends GQL.EdgeType>(_: {
    edgeType: Type
    edgeId: Id
    deleterProfileId: Id
    assertions: null | AssertionOf<typeof _conn>
  }) => Promise<DocumentEdgeByType<Type> | GQL.DeleteEdgeMutationErrorType>
}

export type DeleteInput<Type extends GQL.EdgeType = GQL.EdgeType> = {
  ctx: MoodleNetExecutionContext
  id: Id
  edgeType: Type
}

export const del = QMMutation(
  <Type extends GQL.EdgeType = GQL.EdgeType>({ ctx, edgeType, id: edgeId }: DeleteInput<Type>) =>
    async ({ deleteEdge }: DeleteAdapter): Promise<DocumentEdgeByType<Type> | GQL.DeleteEdgeMutationErrorType> => {
      const sessionCtx = getSessionExecutionContext(ctx)

      if (!(sessionCtx && assertCtx(ctx, _ctx.ExecutorIsAuthenticated))) {
        return 'NotAuthorized'
      }
      const deleterProfileId = sessionCtx.profileId
      const assertions = null //_conn.ExecutorDeletedThisEdge
      const result = await deleteEdge({ edgeId, assertions, edgeType, deleterProfileId })
      if (!result) {
        return 'AssertionFailed'
      }
      return result
    },
)

QMModule(module)
