import { GraphEdge } from '@moodlenet/common/lib/content-graph/types/edge'
import {
  GraphNode,
  GraphNodeIdentifier,
  GraphNodeIdentifierSlug,
  GraphNodeType,
  Profile,
} from '@moodlenet/common/lib/content-graph/types/node'
import { AuthId, SessionEnv } from '@moodlenet/common/lib/types'
import { newGlyphIdentifiers } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { DistOmit, Maybe } from '@moodlenet/common/lib/utils/types'
import { QMCommand, QMModule } from '../../lib/qmino'
import { getGraphBV, getGraphOperators } from './common'
import { CreateEdgeInput } from './edge'

// query by id
// export const getNodeByIdentifier = stub<
//   <Type extends GraphNodeType>(_: GraphNodeIdentifier<Type>) => Promise<Maybe<GraphNode<Type>>>
// >(ns('get-node-by-identifier'))

export async function getByIdentifier<Type extends GraphNodeType>(
  _env: SessionEnv | null,
  identifier: GraphNodeIdentifierSlug<Type>,
) {
  const { graphNode } = await getGraphOperators()
  return getGraphBV(graphNode(identifier))
}

// create
export type CreateNodeAdapter = {
  storeNode: <N extends GraphNode>(_: { node: N }) => Promise<N | undefined>
  createEdge: (_: CreateEdgeInput) => Promise<GraphEdge | null>
  getProfileByAuthId: (_: { authId: AuthId }) => Promise<Maybe<Profile>>
}
export type NewNodeData<N extends GraphNode = GraphNode> = DistOmit<N, '_permId' | '_slug'>
export type CreateNode = {
  nodeData: NewNodeData
  sessionEnv: SessionEnv
}

export const createNode = QMCommand(
  ({ nodeData, sessionEnv }: CreateNode) =>
    async ({ storeNode, getProfileByAuthId, createEdge }: CreateNodeAdapter) => {
      const authProfile = await getProfileByAuthId({ authId: sessionEnv.user.authId })
      if (!authProfile) {
        return 'unauthorized' as const
      }
      const ids = newGlyphIdentifiers({ name: nodeData.name })
      const node: GraphNode = {
        ...ids,
        ...nodeData,
      }
      const result = await storeNode({ node })
      if (!result) {
        return null
      }

      await createEdge({
        from: authProfile,
        to: result,
        newEdge: { _type: 'Created' },
        sessionEnv,
      })

      return result
    },
)

// edit
export type EditNodeAdapter = {
  updateNode: <N extends GraphNodeType = GraphNodeType>(_: {
    nodeData: EditNodeData<N>
    nodeId: GraphNodeIdentifier
  }) => Promise<GraphNode<N> | undefined>
}
export type EditNodeData<N extends GraphNodeType = GraphNodeType> = Partial<
  DistOmit<GraphNode<N>, '_permId' | '_slug' | '_type'>
> &
  Pick<GraphNode<N>, '_type'>
export type EditNode<N extends GraphNodeType = GraphNodeType> = {
  nodeData: EditNodeData<N>
  nodeId: GraphNodeIdentifier
  sessionEnv: SessionEnv
}

export const editNode = QMCommand(
  <N extends GraphNodeType = GraphNodeType>({ nodeData, nodeId /* , sessionEnv  */ }: EditNode<N>) =>
    async ({ updateNode }: EditNodeAdapter) => {
      const result = await updateNode({ nodeData, nodeId })
      if (!result) {
        return null
      }
      return result
    },
)

export type CreateProfile = {
  partProfile: Partial<Omit<Profile, `_${string}`>> & Pick<Profile, 'name' | '_authId'>
}

export type CreateProfileAdapter = {
  storeNode: <N extends GraphNode>(_: { node: N }) => Promise<N | undefined>
}
export const createProfile = QMCommand(
  ({ partProfile }: CreateProfile) =>
    async ({ storeNode }: CreateProfileAdapter) => {
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
      const result = await storeNode<Profile>({ node: profile })
      if (!result) {
        return null
      }
      return result
    },
)

// delete

export type DeleteNodeAdapter = {
  deleteNode: (_: { node: GraphNodeIdentifier }) => Promise<boolean>
}

export type DeleteNodeInput = {
  sessionEnv: SessionEnv
  node: GraphNodeIdentifier
}

export const deleteNode = QMCommand(
  ({ node /* , sessionEnv */ }: DeleteNodeInput) =>
    async ({ deleteNode }: DeleteNodeAdapter) => {
      // const rule = deleteNodeRule({
      //   nodeType,
      //   from,
      //   profileId: getProfileId(env),
      //   ops,
      //   to,
      //   userRole: env.user.role,
      // })
      // const _authId = sessionEnv.user.authId
      const result = await deleteNode({ node })

      return result
    },
)

QMModule(module)
