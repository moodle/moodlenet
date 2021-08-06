import {
  GraphNode,
  GraphNodeByType,
  GraphNodeType,
  Profile,
  Slug,
} from '@moodlenet/common/lib/content-graph/types/node'
import { newGlyphIdentifiers } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { DistOmit, Maybe } from '@moodlenet/common/lib/utils/types'
import { SessionEnv } from '../../lib/auth/types'
import { QMCommand, QMModule, QMQuery } from '../../lib/qmino'

// query by id
export type BySlugAdapter = {
  getNodeBySlug: <Type extends GraphNodeType>(_: { type: Type; slug: Slug }) => Promise<Maybe<GraphNodeByType<Type>>>
}

export type BySlugInput<Type extends GraphNodeType> = {
  slug: Slug
  type: Type
  env: SessionEnv | null
}

export const getBySlug = QMQuery(
  <Type extends GraphNodeType>({ type, slug }: BySlugInput<Type>) =>
    async ({ getNodeBySlug }: BySlugAdapter) => {
      return getNodeBySlug({ slug, type })
    },
)

// create
export type CreateNodeAdapter = {
  storeNode: <N extends GraphNode>(_: { node: N }) => Promise<N | undefined>
}
export type NewNodeInput = DistOmit<GraphNode, '_permId' | '_slug'>
export type CreateNode = {
  newNode: NewNodeInput
  sessionEnv: SessionEnv
}

export const createNode = QMCommand(
  ({ newNode /* , sessionEnv */ }: CreateNode) =>
    async ({ storeNode }: CreateNodeAdapter) => {
      const ids = newGlyphIdentifiers({ name: newNode.name })
      const node: GraphNode = {
        ...ids,
        ...newNode,
      }
      const result = await storeNode({ node })
      if (!result) {
        return null
      }

      // FIXME: Created Edge !

      return result
    },
)
export type CreateProfile = {
  partProfile: Partial<Omit<Profile, `_${string}`>> & Pick<Profile, 'name' | '_authId'>
}

export const createProfile = QMCommand(({ partProfile }: CreateProfile) => async ({ storeNode }: CreateNodeAdapter) => {
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
})

QMModule(module)
