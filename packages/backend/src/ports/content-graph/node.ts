import { Assumptions, BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import {
  EditNodeAssumptionsFactoryMap,
  EditNodeOperators,
  getEditNodeAssumptions,
} from '@moodlenet/common/lib/content-graph/bl/graph-lang/EditNode'
import { GraphNode, GraphNodeIdentifier, GraphNodeType, Profile } from '@moodlenet/common/lib/content-graph/types/node'
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
  <N extends GraphNode>(_: { node: N; creatorNode: BV<GraphNode | null> | null }) => Promise<N | undefined | null>
>(ns(__dirname, 'create-node-adapter'))
export type NewNodeData<N extends GraphNode = GraphNode> = DistOmit<N, '_permId' | '_slug'>
export type CreateNode = {
  nodeData: NewNodeData
  sessionEnv: SessionEnv
}

export const createNode = plug(ns(__dirname, 'create-node'), async ({ nodeData, sessionEnv }: CreateNode) => {
  const { graphNode } = await getGraphOperatorsAdapter()
  const { getBV } = await getBaseOperatorsAdapter()
  const authProfile = await getBV(graphNode({ _authId: sessionEnv.user.authId, _type: 'Profile' }))

  // const authProfile = await getProfileByAuthId({ authId: sessionEnv.user.authId })
  if (!authProfile) {
    return 'unauthorized' as const
  }
  const ids = newGlyphIdentifiers({ name: nodeData.name })
  const node: GraphNode = {
    ...ids,
    ...nodeData,
  }
  const graphOperators = await getGraphOperatorsAdapter()
  const creatorNode = graphOperators.graphNode({ _authId: sessionEnv.user.authId, _type: 'Profile' })
  const result = await createNodeAdapter({ node, creatorNode })
  if (!result) {
    return null
  }
  await addEdgeAdapter({
    assumptions: {},
    edge: {
      _type: 'Created',
      _authId: sessionEnv.user.authId,
      _created: Number(new Date()),
      id: newGlyphPermId(),
    },
    issuer: creatorNode,
    from: graphOperators.graphNode(authProfile),
    to: graphOperators.graphNode(result),
  })

  return result
})

// edit

export const editNodeAdapter = plug<
  <N extends GraphNodeType = GraphNodeType>(_: {
    nodeData: BV<EditNodeData<N>>
    issuer: BV<GraphNode | null>
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
      issuer: graphOperators.graphNode({ _authId: sessionEnv.user.authId, _type: 'Profile' }),
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

export type CreateProfile = {
  partProfile: Partial<Omit<Profile, `_${string}`>> & Pick<Profile, 'name' | '_authId' | '_published' | '_isAdmin'>
}

export const createProfile = plug(ns(__dirname, 'create-profile'), async ({ partProfile }: CreateProfile) => {
  const ids = newGlyphIdentifiers({ name: partProfile.name })
  const profile: Profile = {
    ...ids,
    _type: 'Profile',
    avatar: undefined,
    bio: '',
    description: '',
    firstName: undefined,
    image: undefined,
    lastName: undefined,
    location: undefined,
    siteUrl: undefined,
    ...partProfile,
  }
  const graphOperators = await getGraphOperatorsAdapter()
  const creatorNode = graphOperators.graphNode({ _authId: profile._authId, _type: 'Profile' })

  const result = await createNodeAdapter<Profile>({ node: profile, creatorNode })
  if (!result) {
    return null
  }
  return result
})

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
