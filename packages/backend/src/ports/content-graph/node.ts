import { GraphEdge } from '@moodlenet/common/lib/content-graph/types/edge'
import {
  GraphNode,
  GraphNodeIdentifier,
  GraphNodeIdentifierSlug,
  GraphNodeType,
  Profile,
} from '@moodlenet/common/lib/content-graph/types/node'
import { AuthId } from '@moodlenet/common/lib/user-auth/types'
import { newGlyphIdentifiers } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { DistOmit, Maybe } from '@moodlenet/common/lib/utils/types'
import { SessionEnv } from '../../lib/auth/types'
import { QMCommand, QMModule, QMQuery } from '../../lib/qmino'
import { CreateEdgeInput } from './edge'

// query by id
export type BySlugAdapter = {
  getNodeBySlug: <Type extends GraphNodeType>(_: GraphNodeIdentifierSlug<Type>) => Promise<Maybe<GraphNode<Type>>>
}

export type BySlugInput<Type extends GraphNodeType> = GraphNodeIdentifierSlug<Type> & {
  env: SessionEnv | null
}

export const getBySlug = QMQuery(
  <Type extends GraphNodeType>({ env, ...nodeSlugId }: BySlugInput<Type>) =>
    async ({ getNodeBySlug }: BySlugAdapter) => {
      return getNodeBySlug(nodeSlugId)
    },
)

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
export type EditNodeData<N extends GraphNodeType = GraphNodeType> = DistOmit<GraphNode<N>, '_permId' | '_slug'>
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

QMModule(module)
