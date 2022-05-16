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
import { useEditResourceMutation } from '../../../../pages/Resource/Ctrl/ResourcePage.gen'
import { ResourceCardLegacyProps } from '../ResourceCardLegacy'
import {
  useAddResourceCardLegacyRelationMutation,
  useDelResourceCardLegacyRelationMutation,
  useResourceCardLegacyQuery,
} from './ResourceCardLegacy.gen'

export type ResourceCardLegacyCtrlArg = {
  id: ID
  removeAction: false | null | (() => unknown)
}
export const useResourceCardLegacyCtrl: CtrlHook<
  ResourceCardLegacyProps,
  ResourceCardLegacyCtrlArg
> = ({ id, removeAction }) => {
  const { session, isAuthenticated } = useSession()
  const { data, refetch } = useResourceCardLegacyQuery({
    variables: { id, myProfileId: session ? [session.profile.id] : [] },
    fetchPolicy: 'cache-and-network',
  })
  const resourceNode = narrowNodeType(['Resource'])(data?.node)
  const creatorId = resourceNode?.creator.edges[0]?.node.id
  const isOwner = !!session && creatorId === session.profile.id

  const [addRelation, addRelationRes] =
    useAddResourceCardLegacyRelationMutation()
  const [delRelation, delRelationRes] =
    useDelResourceCardLegacyRelationMutation()
  const [edit, editRes] = useEditResourceMutation()
  const toggleVisible = useCallback(() => {
    if (!(resourceNode && session && !editRes.loading)) {
      return
    }
    return edit({
      variables: {
        id,
        resInput: {
          _published: !resourceNode._published,
          description: resourceNode.description,
          name: resourceNode.name,
        },
      },
    })
  }, [edit, editRes.loading, id, resourceNode, session])

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

  const ResourceCardLegacyUIProps = useMemo<ResourceCardLegacyProps | null>(
    () =>
      resourceNode
        ? {
            toggleVisible,
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
                type: 'subject',
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
      toggleVisible,
      myLikeEdgeId,
      myBookmarkedEdgeId,
      toggleLike,
      toggleBookmark,
      isAuthenticated,
      removeAction,
      isOwner,
    ]
  )
  return ResourceCardLegacyUIProps && [ResourceCardLegacyUIProps]
}
