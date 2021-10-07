// create

import { Assumptions, BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import {
  AddEdgeAssumptionsFactoryMap,
  AddEdgeOperators,
  getAddEdgeAssumptions,
} from '@moodlenet/common/lib/content-graph/bl/graph-lang/AddEdge'
import { GraphEdge, GraphEdgeIdentifier } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNode, GraphNodeIdentifier } from '@moodlenet/common/lib/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/lib/types'
import { newGlyphPermId } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { ns } from '../../lib/ns/namespace'
import { QMModule } from '../../lib/qmino'
import { QMCommand } from '../../lib/qmino/lib'
import { stub, value } from '../../lib/stub/Stub'
import { getBaseOperators, getGraphOperators } from './common'

export type NewEdgeInput = DistOmit<GraphEdge, '_authId' | '_created' | 'id'>
export const storeEdge = stub<
  <E extends GraphEdge>(_: {
    edge: E
    issuer: BV<GraphNode | null>
    from: BV<GraphNode | null>
    to: BV<GraphNode | null>
    assumptions: Assumptions
  }) => Promise<E | null>
>(ns('store-edge'))
export const getAddEdgeAssumptionsMap = value<AddEdgeAssumptionsFactoryMap>(ns('get-add-edge-assumptions-map'), {})
export const getAddEdgeOperators = value<AddEdgeOperators>(ns('get-add-edge-operators'))

export type AddEdgeInput = {
  sessionEnv: SessionEnv
  from: GraphNodeIdentifier
  to: GraphNodeIdentifier
  newEdge: NewEdgeInput
}

export type AddEdgePort = (_: AddEdgeInput) => Promise<GraphEdge | null>
export const addEdge = stub<AddEdgePort>(ns('add-edge'), async ({ from, to, sessionEnv, newEdge }) => {
  const graphOperators = await getGraphOperators()
  const baseOperators = await getBaseOperators()
  const addEdgeOperators = await getAddEdgeOperators()
  const assumptionsMap = await getAddEdgeAssumptionsMap()
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
  // console.log({ assumptions })
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
})

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
