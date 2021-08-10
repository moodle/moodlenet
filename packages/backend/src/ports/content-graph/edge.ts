// create

import { GraphEdge } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNodeIdentifier } from '@moodlenet/common/lib/content-graph/types/node'
import { newGlyphPermId } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { SessionEnv } from '../../lib/auth/types'
import { QMModule } from '../../lib/qmino'
import { QMCommand } from '../../lib/qmino/lib'

export type NewEdgeInput = DistOmit<GraphEdge, '_authId' | '_created' | 'id'>
export type CreateAdapter = {
  storeEdge: <E extends GraphEdge>(_: {
    edge: E
    from: GraphNodeIdentifier
    to: GraphNodeIdentifier
  }) => Promise<E | null>
  // ops: CreateEdgeBLOps
}

export type CreateEdgeInput = {
  sessionEnv: SessionEnv
  from: GraphNodeIdentifier
  to: GraphNodeIdentifier
  newEdge: NewEdgeInput
}

export const createEdge = QMCommand(
  ({ from, to, sessionEnv, newEdge }: CreateEdgeInput) =>
    async ({ storeEdge }: CreateAdapter) => {
      // const rule = createEdgeRule({
      //   edgeType,
      //   from,
      //   profileId: getProfileId(env),
      //   ops,
      //   to,
      //   userRole: env.user.role,
      // })
      const _authId = sessionEnv.user.authId
      const edge: GraphEdge = {
        ...newEdge,
        _authId,
        _created: Number(new Date()),
        id: newGlyphPermId(),
      }
      const result = await storeEdge({ edge, from, to })
      if (!result) {
        return null
      }
      return result
    },
)

// // delete

// export type DeleteAdapter = {
//   deleteEdge: <Type extends GQL.EdgeType>(_: {
//     edgeType: Type
//     edgeId: NodeId
//     deleterProfileId: NodeId
//   }) => Promise<DocumentEdgeByType<Type> | GQL.DeleteEdgeMutationErrorType>
// }

// export type DeleteInput<Type extends GQL.EdgeType = GQL.EdgeType> = {
//   env: SessionEnv
//   id: NodeId
//   edgeType: Type
// }

// export const del = QMCommand(
//   <Type extends GQL.EdgeType = GQL.EdgeType>({ env, edgeType, id: edgeId }: DeleteInput<Type>) =>
//     async ({ deleteEdge }: DeleteAdapter): Promise<DocumentEdgeByType<Type> | GQL.DeleteEdgeMutationErrorType> => {
//       const deleterProfileId = getProfileId(env)
//       const result = await deleteEdge({ edgeId, edgeType, deleterProfileId })
//       if (!result) {
//         return 'AssertionFailed'
//       }
//       return result
//     },
// )

QMModule(module)
