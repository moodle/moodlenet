import { narrowNodeType } from '@moodlenet/common/dist/graphql/helpers'
import { ID } from '@moodlenet/common/dist/graphql/scalars.graphql'
import { DistOmit } from '@moodlenet/common/dist/utils/types'
import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useCallback, useMemo } from 'react'
import { useLocalInstance } from '../../../../../../context/Global/LocalInstance'
import { useSession } from '../../../../../../context/Global/Session'
import { getMaybeAssetRefUrl } from '../../../../../../helpers/data'
import { href } from '../../../../../elements/link'
import { CtrlHook } from '../../../../../lib/ctrl'
import { useEditCollectionMutation } from '../../../../pages/Collection/Ctrl/CollectionPage.gen'
import { CollectionCardLegacyProps } from '../CollectionCardLegacy'
import {
  useAddCollectionCardLegacyRelationMutation,
  useCollectionCardLegacyQuery,
  useDelCollectionCardLegacyRelationMutation,
} from './CollectionCardLegacy.gen'

export type CollectionCardLegacyCtrlArg = { id: ID }
type ProvidesProps = DistOmit<CollectionCardLegacyProps, 'isEditing'>
export const useCollectionCardLegacyCtrl: CtrlHook<
  ProvidesProps,
  CollectionCardLegacyCtrlArg
> = ({ id }) => {
  const { org: localOrg } = useLocalInstance()
  const { session, isAuthenticated } = useSession()

  const { data, refetch } = useCollectionCardLegacyQuery({
    variables: { id, myProfileId: session ? [session.profile.id] : [] },
    fetchPolicy: 'cache-and-network',
  })
  const collectionNode = narrowNodeType(['Collection'])(data?.node)
  const creatorId = collectionNode?.creator.edges[0]?.node.id
  const isOwner = !!session && creatorId === session.profile.id

  const [addRelation, addRelationRes] =
    useAddCollectionCardLegacyRelationMutation()
  const [delRelation, delRelationRes] =
    useDelCollectionCardLegacyRelationMutation()

  const [edit, editColl] = useEditCollectionMutation()
  const toggleVisible = useCallback(() => {
    if (!(collectionNode && session && !editColl.loading)) {
      return
    }
    return edit({
      variables: {
        id,
        collInput: {
          _published: !collectionNode._published,
          description: collectionNode.description,
          name: collectionNode.name,
        },
      },
    })
  }, [collectionNode, edit, editColl.loading, id, session])

  const myFollowEdgeId = collectionNode?.myFollow.edges[0]?.edge.id
  const toggleFollow = useCallback(() => {
    if (!session || addRelationRes.loading || delRelationRes.loading) {
      return
    }
    if (myFollowEdgeId) {
      return delRelation({ variables: { edge: { id: myFollowEdgeId } } }).then(
        () => refetch()
      )
    } else {
      return addRelation({
        variables: {
          edge: {
            edgeType: 'Follows',
            from: session.profile.id,
            to: id,
            Follows: {},
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
    myFollowEdgeId,
    refetch,
    session,
  ])

  const myBookmarkedEdgeId = collectionNode?.myBookmarked.edges[0]?.edge.id
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

  const CollectionCardLegacyUIProps = useMemo<CollectionCardLegacyProps | null>(
    () =>
      collectionNode
        ? {
            toggleVisible,
            organization: localOrg.name,
            title: collectionNode.name,
            imageUrl: getMaybeAssetRefUrl(collectionNode.image),
            collectionHref: href(nodeGqlId2UrlPath(id)),
            following: !!myFollowEdgeId,
            bookmarked: !!myBookmarkedEdgeId,
            isAuthenticated,
            numFollowers: collectionNode.followersCount,
            toggleBookmark,
            toggleFollow,
            isOwner,
            visibility: collectionNode._published ? 'Public' : 'Private',
          }
        : null,
    [
      toggleVisible,
      collectionNode,
      id,
      isAuthenticated,
      localOrg.name,
      myBookmarkedEdgeId,
      myFollowEdgeId,
      toggleBookmark,
      toggleFollow,
      isOwner,
    ]
  )

  return CollectionCardLegacyUIProps && [CollectionCardLegacyUIProps]
}
