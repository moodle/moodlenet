import { BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { GraphNode, GraphNodeIdentifier, GraphNodeType, Profile } from '@moodlenet/common/lib/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/lib/types'
import { newGlyphIdentifiers, newGlyphPermId } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { ns } from '../../lib/ns/namespace'
import { plug } from '../../lib/stub/Stub'
import { getBaseOperatorsAdapter, getGraphOperatorsAdapter } from './common'
import { addEdgeAdapter } from './edge'

export const byIdentifier = plug(
  ns('by-identifier'),
  async <Type extends GraphNodeType>(_env: SessionEnv | null, identifier: GraphNodeIdentifier<Type>) => {
    const { getBV } = await getBaseOperatorsAdapter()
    const { graphNode } = await getGraphOperatorsAdapter()
    return getBV(graphNode(identifier))
  },
)

// create
export const createNodeAdapter = plug<<N extends GraphNode>(_: { node: N }) => Promise<N | undefined>>(
  ns('create-node-adapter'),
)
export type NewNodeData<N extends GraphNode = GraphNode> = DistOmit<N, '_permId' | '_slug'>
export type CreateNode = {
  nodeData: NewNodeData
  sessionEnv: SessionEnv
}

export const createNode = plug(ns('create-node'), async ({ nodeData, sessionEnv }: CreateNode) => {
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
  const result = await createNodeAdapter({ node })
  if (!result) {
    return null
  }
  const graphOperators = await getGraphOperatorsAdapter()
  await addEdgeAdapter({
    assumptions: {},
    edge: {
      _type: 'Created',
      _authId: sessionEnv.user.authId,
      _created: Number(new Date()),
      id: newGlyphPermId(),
    },
    issuer: graphOperators.graphNode({ _authId: sessionEnv.user.authId, _type: 'Profile' }),
    from: graphOperators.graphNode(authProfile),
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
  }) => Promise<GraphNode<N> | undefined>
>(ns('edit-node-adapter'))

export type EditNodeData<N extends GraphNodeType = GraphNodeType> = Partial<
  DistOmit<GraphNode<N>, '_permId' | '_slug' | '_type'>
> &
  Pick<GraphNode<N>, '_type'>
export type EditNode<N extends GraphNodeType = GraphNodeType> = {
  nodeData: EditNodeData<N>
  nodeId: GraphNodeIdentifier<N>
  sessionEnv: SessionEnv
}

export const editNode = plug(
  ns('edit'),
  async <N extends GraphNodeType = GraphNodeType>({ nodeData, nodeId /* , sessionEnv  */ }: EditNode<N>) => {
    const { graphNode } = await getGraphOperatorsAdapter()
    const { _ } = await getBaseOperatorsAdapter()
    const result = await editNodeAdapter({
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
  partProfile: Partial<Omit<Profile, `_${string}`>> & Pick<Profile, 'name' | '_authId'>
}

export const createProfile = plug(ns('create-profile'), async ({ partProfile }: CreateProfile) => {
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
  const result = await createNodeAdapter<Profile>({ node: profile })
  if (!result) {
    return null
  }
  return result
})

// delete

export const deleteNodeAdapter = plug<(_: { node: BV<GraphNode | null>; type: GraphNodeType }) => Promise<boolean>>(
  ns('delete-node-adapter'),
)

export type DeleteNodeInput = {
  sessionEnv: SessionEnv
  node: GraphNodeIdentifier
}

export const deleteNode = plug(ns('delete-node'), async ({ node /* , sessionEnv */ }: DeleteNodeInput) => {
  const { graphNode } = await getGraphOperatorsAdapter()
  const result = await deleteNodeAdapter({ node: graphNode(node), type: node._type })

  return result
})
