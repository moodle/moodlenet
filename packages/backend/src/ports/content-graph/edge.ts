// create

import { Assumptions, BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import {
  AddEdgeAssumptionsMap,
  AddEdgeOperators,
  getAddEdgeAssumptions,
} from '@moodlenet/common/lib/content-graph/bl/graph-lang/AddEdge'
import { GraphEdge, GraphEdgeIdentifier, GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNode, GraphNodeIdentifier } from '@moodlenet/common/lib/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/lib/types'
import { newGlyphPermId } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { ns } from '../../lib/ns/namespace'
import { plug, value } from '../../lib/plug'
import { getBaseOperatorsAdapter, getGraphOperatorsAdapter } from './common'

export type NewEdgeInput = DistOmit<GraphEdge, '_authId' | '_created' | 'id'>
export const addEdgeAdapter = plug<
  <E extends GraphEdge>(_: {
    edge: E
    issuer: BV<GraphNode | null>
    from: BV<GraphNode | null>
    to: BV<GraphNode | null>
    assumptions: Assumptions
  }) => Promise<E | null>
>(ns(__dirname, 'add-edge-adapter'))
export const getAddEdgeAssumptionsMap = value<AddEdgeAssumptionsMap>(ns(__dirname, 'get-add-edge-assumptions-map'))
export const getAddEdgeOperatorsAdapter = value<AddEdgeOperators>(ns(__dirname, 'get-add-edge-operators-adapter'))
export const deleteEdgeAdapter = plug<(_: { edge: BV<GraphEdge | null>; edgeType: GraphEdgeType }) => Promise<boolean>>(
  ns(__dirname, 'delete-edge-adapter'),
)

export type AddEdgeInput = {
  sessionEnv: SessionEnv
  from: GraphNodeIdentifier
  to: GraphNodeIdentifier
  newEdge: NewEdgeInput
}

export type AddEdgePort = (_: AddEdgeInput) => Promise<GraphEdge | null>
export const addEdge = plug<AddEdgePort>(ns(__dirname, 'add-edge'), async ({ from, to, sessionEnv, newEdge }) => {
  const graphOperators = await getGraphOperatorsAdapter()
  const baseOperators = await getBaseOperatorsAdapter()
  const addEdgeOperators = await getAddEdgeOperatorsAdapter()
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

  const result = await addEdgeAdapter({
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

export type DeleteEdgeInput = {
  sessionEnv: SessionEnv
  edge: GraphEdgeIdentifier
}

export const deleteEdge = plug(ns(__dirname, 'delete-edge'), async ({ edge /* , sessionEnv */ }: DeleteEdgeInput) => {
  // const _authId = sessionEnv.user.authId
  const { graphEdge } = await getGraphOperatorsAdapter()
  const result = await deleteEdgeAdapter({ edge: graphEdge(edge), edgeType: edge._type })
  return result
})
