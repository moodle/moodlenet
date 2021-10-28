import { Assumptions, BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import {
  EditNodeAssumptionsFactoryMap,
  EditNodeOperators,
  getEditNodeAssumptions,
} from '@moodlenet/common/lib/content-graph/bl/graph-lang/EditNode'
import {
  GraphNode,
  GraphNodeIdentifier,
  GraphNodeIdentifierAuth,
  GraphNodeType,
} from '@moodlenet/common/lib/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/lib/types'
import { newGlyphIdentifiers, newGlyphPermId } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { ns } from '../../lib/ns/namespace'
import { plug, value } from '../../lib/plug'
import { getBaseOperatorsAdapter, getGraphOperatorsAdapter } from './common'
import { addEdgeAdapter } from './edge'

export const byIdentifier = plug(
  ns(__dirname, 'by-identifier'),
  async <Type extends GraphNodeType>(_env: SessionEnv | null, identifier: GraphNodeIdentifier<Type>) => {
    const { getBV } = await getBaseOperatorsAdapter()
    const { graphNode } = await getGraphOperatorsAdapter()
    return getBV(graphNode(identifier))
  },
)

// create
export const createNodeAdapter = plug<
  <N extends GraphNode>(_: { node: N; issuer: BV<GraphNode | null> }) => Promise<N | undefined | null>
>(ns(__dirname, 'create-node-adapter'))
export type NewNodeData<N extends GraphNode = GraphNode> = DistOmit<
  N,
  '_permId' | '_slug' | '_created' | '_edited' | '_authKey' | '_creator'
>
export type CreateNode = {
  nodeData: NewNodeData
  sessionEnv: SessionEnv
}

export const createNode = plug(ns(__dirname, 'create-node'), async ({ nodeData, sessionEnv }: CreateNode) => {
  const { graphNode } = await getGraphOperatorsAdapter()
  // const { getBV } = await getBaseOperatorsAdapter()
  const authProfileBV = graphNode(sessionEnv.authId)
  // const authProfile = await getBV(graphNode({ _authKey: sessionEnv.user.authId, _type: 'Profile' }))
  // // const authProfile = await getProfileByAuthId({ authId: sessionEnv.user.authId })
  // if (!authProfile) {
  //   return 'unauthorized' as const
  // }
  const ids = newGlyphIdentifiers({ name: nodeData.name })
  const now = Number(new Date())
  const node: GraphNode = {
    ...ids,
    ...nodeData,
    _authKey: null,
    _created: now,
    _edited: now,
    _creator: sessionEnv.authId,
  }
  const graphOperators = await getGraphOperatorsAdapter()
  const creatorNode = graphOperators.graphNode(sessionEnv.authId)
  const result = await createNodeAdapter({ node, issuer: creatorNode })
  if (!result) {
    return null
  }
  await addEdgeAdapter({
    assumptions: {},
    edge: {
      _type: 'Created',
      _authId: sessionEnv.authId,
      _created: now,
      _edited: now,
      id: newGlyphPermId(),
    },
    issuer: creatorNode,
    from: authProfileBV,
    to: graphOperators.graphNode(result),
  })

  return result
})

// edit

export const editNodeAdapter = plug<
  <N extends GraphNodeType = GraphNodeType>(_: {
    nodeData: BV<EditNodeData<N>>
    nodeId: BV<GraphNode<N> | null>
    type: GraphNodeType
    assumptions: Assumptions
  }) => Promise<GraphNode<N> | undefined>
>(ns(__dirname, 'edit-node-adapter'))

export type EditNodeData<N extends GraphNodeType = GraphNodeType> = Partial<
  DistOmit<GraphNode<N>, '_permId' | '_slug' | '_type'>
> &
  Pick<GraphNode<N>, '_type'>
export type EditNode<N extends GraphNodeType = GraphNodeType> = {
  nodeData: EditNodeData<N>
  nodeId: GraphNodeIdentifier<N>
  sessionEnv: SessionEnv
}

export const getEditNodeAssumptionsMap = value<EditNodeAssumptionsFactoryMap>(
  ns(__dirname, 'get-edit-node-assumptions-map'),
)
export const getEditNodeOperatorsAdapter = value<EditNodeOperators>(ns(__dirname, 'get-edit-node-operators-adapter'))
export const editNode = plug(
  ns(__dirname, 'edit-node'),
  async <N extends GraphNodeType = GraphNodeType>({ nodeData, nodeId, sessionEnv }: EditNode<N>) => {
    const graphOperators = await getGraphOperatorsAdapter()
    const baseOperators = await getBaseOperatorsAdapter()
    const editNodeOperators = await getEditNodeOperatorsAdapter()
    const editNodeAssumptionsMap = await getEditNodeAssumptionsMap()
    const assumptions = await getEditNodeAssumptions({
      map: editNodeAssumptionsMap,
      env: sessionEnv,
      baseOperators,
      graphOperators,
      editNodeOperators,
      nodeIdentifier: nodeId,
    })
    if (!assumptions) {
      return null
    }
    const { graphNode } = graphOperators
    const { _ } = baseOperators
    const result = await editNodeAdapter({
      assumptions,
      nodeData: _(nodeData),
      nodeId: graphNode(nodeId),
      type: nodeId._type,
    })
    if (!result) {
      return null
    }
    return result
  },
)

export type CreateAuthNode = {
  authNode: DistOmit<GraphNode, '_created' | '_edited' | '_permId' | '_slug' | '_type' | '_authKey'>
  authId: GraphNodeIdentifierAuth
}

export const createAuthNode = plug(
  ns(__dirname, 'create-auth-profile'),
  async ({ authNode, authId }: CreateAuthNode) => {
    const ids = newGlyphIdentifiers({ name: authNode.name })
    const now = Number(new Date())
    const newAuthNode = {
      ...ids,
      ...authNode,
      ...authId,
      _created: now,
      _edited: now,
    } as GraphNode
    const graphOperators = await getGraphOperatorsAdapter()
    const creatorNode = graphOperators.graphNode(authId)

    const result = await createNodeAdapter({ node: newAuthNode, issuer: creatorNode })
    if (!result) {
      return null
    }
    return result
  },
)

// delete

export const deleteNodeAdapter = plug<(_: { node: BV<GraphNode | null>; type: GraphNodeType }) => Promise<boolean>>(
  ns(__dirname, 'delete-node-adapter'),
)

export type DeleteNodeInput = {
  sessionEnv: SessionEnv
  node: GraphNodeIdentifier
}

export const deleteNode = plug(ns(__dirname, 'delete-node'), async ({ node /* , sessionEnv */ }: DeleteNodeInput) => {
  const { graphNode } = await getGraphOperatorsAdapter()
  const result = await deleteNodeAdapter({ node: graphNode(node), type: node._type })

  return result
})
