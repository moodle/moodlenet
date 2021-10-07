// create

import { Assumptions, BaseOperators, BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import {
  AddEdgeAssumptionsFactoryMap,
  AddEdgeOperators,
  getAddEdgeAssumptions,
} from '@moodlenet/common/lib/content-graph/bl/graph-lang/AddEdge'
import { GraphOperators } from '@moodlenet/common/lib/content-graph/bl/graph-lang/graphOperators'
import { GraphEdge, GraphEdgeIdentifier } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNode, GraphNodeIdentifier } from '@moodlenet/common/lib/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/lib/types'
import { newGlyphPermId } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { QMModule } from '../../lib/qmino'
import { QMCommand } from '../../lib/qmino/lib'

export type NewEdgeInput = DistOmit<GraphEdge, '_authId' | '_created' | 'id'>
export type CreateAdapter = {
  storeEdge: <E extends GraphEdge>(_: {
    edge: E
    issuer: BV<GraphNode | null>
    from: BV<GraphNode | null>
    to: BV<GraphNode | null>
    assumptions: Assumptions
  }) => Promise<E | null>
  assumptionsMap: AddEdgeAssumptionsFactoryMap
  graphOperators: GraphOperators
  baseOperators: BaseOperators
  addEdgeOperators: AddEdgeOperators
}

export type CreateEdgeInput = {
  sessionEnv: SessionEnv
  from: GraphNodeIdentifier
  to: GraphNodeIdentifier
  newEdge: NewEdgeInput
}

export const createEdge = QMCommand(
  ({ from, to, sessionEnv, newEdge }: CreateEdgeInput) =>
    async ({ storeEdge, assumptionsMap, addEdgeOperators, baseOperators, graphOperators }: CreateAdapter) => {
      const assumptions = await getAddEdgeAssumptions({
        from,
        edgeType: newEdge._type,
        to,
        map: assumptionsMap,
        env: sessionEnv,
        addEdgeOperators,
        baseOperators,
        graphOperators,
      })
      console.log({ assumptions })
      if (!assumptions) {
        return null
      }
      const _authId = sessionEnv.user.authId
      const edge: GraphEdge = {
        ...newEdge,
        _authId,
        _created: Number(new Date()),
        id: newGlyphPermId(),
      }

      const result = await storeEdge({
        edge,
        issuer: graphOperators.graphNode({ _authId: sessionEnv.user.authId, _type: 'Profile' }),
        from: graphOperators.graphNode(from),
        to: graphOperators.graphNode(to),
        assumptions,
      })
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
