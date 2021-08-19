// create

import { GraphEdge, GraphEdgeIdentifier } from '@moodlenet/common/lib/content-graph/types/edge'
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

// delete

export type DeleteEdgeAdapter = {
  deleteEdge: (_: { edge: GraphEdgeIdentifier }) => Promise<boolean>
}

export type DeleteEdgeInput = {
  sessionEnv: SessionEnv
  edge: GraphEdgeIdentifier
}

export const deleteEdge = QMCommand(
  ({ edge /* , sessionEnv */ }: DeleteEdgeInput) =>
    async ({ deleteEdge }: DeleteEdgeAdapter) => {
      // const rule = deleteEdgeRule({
      //   edgeType,
      //   from,
      //   profileId: getProfileId(env),
      //   ops,
      //   to,
      //   userRole: env.user.role,
      // })
      // const _authId = sessionEnv.user.authId
      const result = await deleteEdge({ edge })

      return result
    },
)

QMModule(module)
