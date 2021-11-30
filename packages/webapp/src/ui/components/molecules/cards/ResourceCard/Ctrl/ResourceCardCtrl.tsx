import {
  isEdgeNodeOfType,
  narrowNodeType,
} from '@moodlenet/common/dist/graphql/helpers'
import { ID } from '@moodlenet/common/dist/graphql/scalars.graphql'
import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useCallback, useMemo } from 'react'
import { useSession } from '../../../../../../context/Global/Session'
import { getMaybeAssetRefUrl } from '../../../../../../helpers/data'
import { href } from '../../../../../elements/link'
import { CtrlHook } from '../../../../../lib/ctrl'
import { ResourceCardProps } from '../ResourceCard'
import {
  useAddResourceCardRelationMutation,
  useDelResourceCardRelationMutation,
  useResourceCardQuery,
} from './ResourceCard.gen'

export type ResourceCardCtrlArg = {
  id: ID
  removeAction: false | null | (() => unknown)
}
export const useResourceCardCtrl: CtrlHook<
  ResourceCardProps,
  ResourceCardCtrlArg
> = ({ id, removeAction }) => {
  const { session, isAuthenticated } = useSession()
  const { data, refetch } = useResourceCardQuery({
    variables: { id, myProfileId: session ? [session.profile.id] : [] },
  })
  const resourceNode = narrowNodeType(['Resource'])(data?.node)
  const creatorId = resourceNode?.creator.edges[0]?.node.id
  const isOwner = !!session && creatorId === session.profile.id

  const [addRelation, addRelationRes] = useAddResourceCardRelationMutation()
  const [delRelation, delRelationRes] = useDelResourceCardRelationMutation()

  const myBookmarkedEdgeId = resourceNode?.myBookmarked.edges[0]?.edge.id
  const toggleBookmark = useCallback(() => {
    if (!session || addRelationRes.loading || delRelationRes.loading) {
      return
    }
    if (myBookmarkedEdgeId) {
      return delRelation({
        variables: { edge: { id: myBookmarkedEdgeId } },
      }).then(() => refetch())
    } else {
      return addRelation({
        variables: {
          edge: {
            edgeType: 'Bookmarked',
            from: session.profile.id,
            to: id,
            Bookmarked: {},
          },
        },
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
      return delRelation({ variables: { edge: { id: myLikeEdgeId } } }).then(
        () => refetch()
      )
    } else {
      return addRelation({
        variables: {
          edge: {
            edgeType: 'Likes',
            from: session.profile.id,
            to: id,
            Likes: {},
          },
        },
      }).then(() => refetch())
    }
  }, [
    addRelation,
    addRelationRes.loading,
    delRelation,
    delRelationRes.loading,
    id,
    myLikeEdgeId,
    refetch,
    session,
  ])

  const resourceCardUIProps = useMemo<ResourceCardProps | null>(
    () =>
      resourceNode
        ? {
            type:
              resourceNode.kind === 'Link'
                ? 'Web Page'
                : resourceNode.content.mimetype,
            image: getMaybeAssetRefUrl(resourceNode.image),
            title: resourceNode.name,
            tags: resourceNode.categories.edges
              .filter(isEdgeNodeOfType(['IscedField']))
              .map(({ node }) => ({
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
            visibility: resourceNode._published ? 'Public' : 'Private',
          }
        : null,
    [
      resourceNode,
      isOwner,
      removeAction,
      myLikeEdgeId,
      myBookmarkedEdgeId,
      toggleLike,
      toggleBookmark,
      isAuthenticated,
    ]
  )
  return resourceCardUIProps && [resourceCardUIProps]
}
