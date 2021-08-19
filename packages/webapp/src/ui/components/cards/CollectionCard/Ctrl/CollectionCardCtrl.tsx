import { narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useCallback, useMemo } from 'react'
import { useLocalInstance } from '../../../../../context/Global/LocalInstance'
import { useSession } from '../../../../../context/Global/Session'
import { getMaybeAssetRefUrlOrDefaultImage } from '../../../../../helpers/data'
import { href } from '../../../../elements/link'
import { CtrlHook } from '../../../../lib/ctrl'
import { CollectionCardProps } from '../CollectionCard'
import {
  useAddCollectionCardRelationMutation,
  useCollectionCardQuery,
  useDelCollectionCardRelationMutation,
} from './CollectionCard.gen'

export type CollectionCardCtrlArg = { id: ID }
export const useCollectionCardCtrl: CtrlHook<CollectionCardProps, CollectionCardCtrlArg> = ({ id }) => {
  const { org: localOrg } = useLocalInstance()

  const { data, refetch } = useCollectionCardQuery({ variables: { id } })
  const collectionNode = narrowNodeType(['Collection'])(data?.node)

  const { session, isAuthenticated } = useSession()
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
            imageUrl: getMaybeAssetRefUrlOrDefaultImage(collectionNode.image, id, 'image'),
            collectionHref: href(nodeGqlId2UrlPath(id)),
            following: !!myFollowEdgeId,
            bookmarked: !!myBookmarkedEdgeId,
            isAuthenticated,
            numFollowers: collectionNode.followersCount,
            toggleBookmark,
            toggleFollow,
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
    ],
  )

  return collectionCardUIProps && [collectionCardUIProps]
}
