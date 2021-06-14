import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { DocumentEdgeByType, DocumentEdgeDataByType } from '../../adapters/content-graph/arangodb/functions/types'
import { getProfileId } from '../../lib/auth/env'
import { SessionEnv } from '../../lib/auth/types'
import { QMCommand, QMModule } from '../../lib/qmino'

// create

export type CreateAdapter = {
  storeEdge: <Type extends GQL.EdgeType>(_: {
    edgeType: Type
    data: DocumentEdgeDataByType<Type>
    from: Id
    to: Id
    creatorProfileId: Id
  }) => Promise<DocumentEdgeByType<Type> | null>
}

export type CreateInput<Type extends GQL.EdgeType = GQL.EdgeType> = {
  env: SessionEnv
  from: Id
  to: Id
  edgeType: Type
  data: DocumentEdgeDataByType<Type>
}

export const create = QMCommand(
  <Type extends GQL.EdgeType = GQL.EdgeType>({ data, env, edgeType, from, to }: CreateInput<Type>) =>
    async ({ storeEdge }: CreateAdapter): Promise<DocumentEdgeByType<Type> | GQL.CreateEdgeMutationErrorType> => {
      const creatorProfileId = getProfileId(env)
      const result = await storeEdge({ from, to, edgeType, data, creatorProfileId })
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
  }) => Promise<DocumentEdgeByType<Type> | GQL.DeleteEdgeMutationErrorType>
}

export type DeleteInput<Type extends GQL.EdgeType = GQL.EdgeType> = {
  env: SessionEnv
  id: Id
  edgeType: Type
}

export const del = QMCommand(
  <Type extends GQL.EdgeType = GQL.EdgeType>({ env, edgeType, id: edgeId }: DeleteInput<Type>) =>
    async ({ deleteEdge }: DeleteAdapter): Promise<DocumentEdgeByType<Type> | GQL.DeleteEdgeMutationErrorType> => {
      const deleterProfileId = getProfileId(env)
      const result = await deleteEdge({ edgeId, edgeType, deleterProfileId })
      if (!result) {
        return 'AssertionFailed'
      }
      return result
    },
)

QMModule(module)
