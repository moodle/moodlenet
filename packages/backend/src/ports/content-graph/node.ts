import { GraphEdge } from '@moodlenet/common/lib/content-graph/types/edge'
import {
  GraphNode,
  GraphNodeByType,
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
  getNodeBySlug: <Type extends GraphNodeType>(_: GraphNodeIdentifierSlug<Type>) => Promise<Maybe<GraphNodeByType<Type>>>
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
export type NewNodeInput<N extends GraphNode = GraphNode> = DistOmit<N, '_permId' | '_slug'>
export type CreateNode = {
  newNode: NewNodeInput
  sessionEnv: SessionEnv
}

export const createNode = QMCommand(
  ({ newNode, sessionEnv }: CreateNode) =>
    async ({ storeNode, getProfileByAuthId, createEdge }: CreateNodeAdapter) => {
      const authProfile = await getProfileByAuthId({ authId: sessionEnv.user.authId })
      if (!authProfile) {
        return 'unauthorized' as const
      }
      const ids = newGlyphIdentifiers({ name: newNode.name })
      const node: GraphNode = {
        ...ids,
        ...newNode,
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
