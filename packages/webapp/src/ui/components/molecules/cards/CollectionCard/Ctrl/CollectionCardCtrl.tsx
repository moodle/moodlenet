import { narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useCallback, useMemo } from 'react'
import { useLocalInstance } from '../../../../../../context/Global/LocalInstance'
import { useSession } from '../../../../../../context/Global/Session'
import { getMaybeAssetRefUrl } from '../../../../../../helpers/data'
import { href } from '../../../../../elements/link'
import { CtrlHook } from '../../../../../lib/ctrl'
import { CollectionCardProps } from '../CollectionCard'
import {
  useAddCollectionCardRelationMutation,
  useCollectionCardQuery,
  useDelCollectionCardRelationMutation,
} from './CollectionCard.gen'

export type CollectionCardCtrlArg = { id: ID }
type ProvidesProps = DistOmit<CollectionCardProps, 'isEditing'>
export const useCollectionCardCtrl: CtrlHook<ProvidesProps, CollectionCardCtrlArg> = ({ id }) => {
  const { org: localOrg } = useLocalInstance()
  const { session, isAuthenticated } = useSession()

  const { data, refetch } = useCollectionCardQuery({
    variables: { id, myProfileId: session ? [session.profile.id] : [] },
  })
  const collectionNode = narrowNodeType(['Collection'])(data?.node)
  const creatorId = collectionNode?.creator.edges[0]?.node.id
  const isOwner = !!session && creatorId === session.profile.id

  const [addRelation, addRelationRes] = useAddCollectionCardRelationMutation()
  const [delRelation, delRelationRes] = useDelCollectionCardRelationMutation()
  const myFollowEdgeId = collectionNode?.myFollow.edges[0]?.edge.id
  const toggleFollow = useCallback(() => {
    if (!session || addRelationRes.loading || delRelationRes.loading) {
      return
    }
    if (myFollowEdgeId) {
      return delRelation({ variables: { edge: { id: myFollowEdgeId } } }).then(() => refetch())
    } else {
      return addRelation({
        variables: { edge: { edgeType: 'Follows', from: session.profile.id, to: id, Follows: {} } },
      }).then(() => refetch())
    }
  }, [addRelation, addRelationRes.loading, delRelation, delRelationRes.loading, id, myFollowEdgeId, refetch, session])

  const myBookmarkedEdgeId = collectionNode?.myBookmarked.edges[0]?.edge.id
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

  const collectionCardUIProps = useMemo<CollectionCardProps | null>(
    () =>
      collectionNode
        ? {
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
      collectionNode,
      id,
      isAuthenticated,
      localOrg.name,
      myBookmarkedEdgeId,
      myFollowEdgeId,
      toggleBookmark,
      toggleFollow,
      isOwner,
    ],
  )

  return collectionCardUIProps && [collectionCardUIProps]
}
