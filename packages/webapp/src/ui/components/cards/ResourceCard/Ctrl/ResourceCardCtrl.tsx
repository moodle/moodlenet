import { isEdgeNodeOfType, narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useCallback, useMemo } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { getMaybeAssetRefUrlOrDefaultImage } from '../../../../../helpers/data'
import { href } from '../../../../elements/link'
import { CtrlHook } from '../../../../lib/ctrl'
import { ResourceCardProps } from '../ResourceCard'
import {
  useAddResourceCardRelationMutation,
  useDelResourceCardRelationMutation,
  useResourceCardQuery,
} from './ResourceCard.gen'

export type ResourceCardCtrlArg = { id: ID }
export const useResourceCardCtrl: CtrlHook<ResourceCardProps, ResourceCardCtrlArg> = ({ id }) => {
  const { data, refetch } = useResourceCardQuery({ variables: { id } })
  const resourceNode = narrowNodeType(['Resource'])(data?.node)
  const { session, isAuthenticated } = useSession()
  const [addRelation, addRelationRes] = useAddResourceCardRelationMutation()
  const [delRelation, delRelationRes] = useDelResourceCardRelationMutation()

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

  const resourceCardUIProps = useMemo<ResourceCardProps | null>(
    () =>
      resourceNode
        ? {
            type: resourceNode.kind === 'Link' ? 'Web Page' : resourceNode.content.mimetype,
            image: getMaybeAssetRefUrlOrDefaultImage(resourceNode.image, id, 'image') ?? '',
            title: resourceNode.name,
            tags: resourceNode.inCollections.edges.filter(isEdgeNodeOfType(['Collection'])).map(edge => edge.node.name),
            resourceHomeHref: href(nodeGqlId2UrlPath(resourceNode.id)),
            liked: !!myLikeEdgeId,
            numLikes: resourceNode.likesCount,
            bookmarked: !!myBookmarkedEdgeId,
            toggleLike,
            toggleBookmark,
            isAuthenticated,
            onRemoveClick: undefined, //() => alert('must implement'),
            showRemoveButton: false,
          }
        : null,
    [resourceNode, id, myLikeEdgeId, myBookmarkedEdgeId, toggleLike, toggleBookmark, isAuthenticated],
  )
  return resourceCardUIProps && [resourceCardUIProps]
}
