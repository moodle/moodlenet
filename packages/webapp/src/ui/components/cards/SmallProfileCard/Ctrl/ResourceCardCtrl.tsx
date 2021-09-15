import { isEdgeNodeOfType, narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useCallback, useMemo } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { getMaybeAssetRefUrlOrDefaultImage } from '../../../../../helpers/data'
import { href } from '../../../../elements/link'
import { CtrlHook } from '../../../../lib/ctrl'
import { SmallProfileCardProps } from '../SmallProfileCard'
import {
  useAddSmallProfileCardRelationMutation,
  useDelSmallProfileCardRelationMutation,
  useSmallProfileCardQuery
} from './SmallProfileCard.gen'

export type SmallProfileCardCtrlArg = { id: ID; removeAction: false | null | (() => unknown) }
export const useSmallProfileCardCtrl: CtrlHook<SmallProfileCardProps, SmallProfileCardCtrlArg> = ({ id, removeAction }) => {
  const { session, isAuthenticated } = useSession()
  const { data, refetch } = useSmallProfileCardQuery({
    variables: { id, myProfileId: session ? [session.profile.id] : [] },
  })
  const resourceNode = narrowNodeType(['Resource'])(data?.node)
  const creatorId = resourceNode?.creator.edges[0]?.node.id
  const isOwner = !!session && creatorId === session.profile.id

  const [addRelation, addRelationRes] = useAddSmallProfileCardRelationMutation()
  const [delRelation, delRelationRes] = useDelSmallProfileCardRelationMutation()

  const myBookmarkedEdgeId = resourceNode?.myBookmarked.edges[0]?.edge.id
  const toggleBookmark = useCallback(() => {
    if (!session || addRelationRes.loading || delRelationRes.loading) {
      return
    }
    if (myBookmarkedEdgeId) {
      return delRelation({ variables: { edge: { id: myBookmarkedEdgeId } } }).then(() => refetch())
    } else {
      return addRelation({
        variables: { edge: { edgeType: 'Bookmarked', from: session.profile.id, to: id, Bookmarked: {} } },
      }).then(() => refetch())
    }
  }, [
    addRelation,
    addRelationRes.loading,
    delRelation,
    delRelationRes.loading,
    id,
    myBookmarkedEdgeId,
    refetch,
    session,
  ])

  const myLikeEdgeId = resourceNode?.myLike.edges[0]?.edge.id
  const toggleLike = useCallback(() => {
    if (!session || addRelationRes.loading || delRelationRes.loading) {
      return
    }
    if (myLikeEdgeId) {
      return delRelation({ variables: { edge: { id: myLikeEdgeId } } }).then(() => refetch())
    } else {
      return addRelation({
        variables: { edge: { edgeType: 'Likes', from: session.profile.id, to: id, Likes: {} } },
      }).then(() => refetch())
    }
  }, [addRelation, addRelationRes.loading, delRelation, delRelationRes.loading, id, myLikeEdgeId, refetch, session])

  const SmallProfileCardUIProps = useMemo<SmallProfileCardProps | null>(
    () =>
      resourceNode
        ? {
            type: resourceNode.kind === 'Link' ? 'Web Page' : resourceNode.content.mimetype,
            image: getMaybeAssetRefUrlOrDefaultImage(resourceNode.image, id, 'image') ?? '',
            title: resourceNode.name,
            tags: resourceNode.categories.edges.filter(isEdgeNodeOfType(['IscedField'])).map(({ node }) => ({
              name: node.name,
              type: 'General',
              subjectHomeHref: href(nodeGqlId2UrlPath(node.id)),
            })),
            resourceHomeHref: href(nodeGqlId2UrlPath(resourceNode.id)),
            liked: !!myLikeEdgeId,
            numLikes: resourceNode.likesCount,
            bookmarked: !!myBookmarkedEdgeId,
            toggleLike,
            toggleBookmark,
            isAuthenticated,
            onRemoveClick: removeAction || undefined,
            showRemoveButton: !!removeAction,
            isOwner,
          }
        : null,
    [
      resourceNode,
      isOwner,
      id,
      removeAction,
      myLikeEdgeId,
      myBookmarkedEdgeId,
      toggleLike,
      toggleBookmark,
      isAuthenticated,
    ],
  )
  return SmallProfileCardUIProps && [SmallProfileCardUIProps]
}
