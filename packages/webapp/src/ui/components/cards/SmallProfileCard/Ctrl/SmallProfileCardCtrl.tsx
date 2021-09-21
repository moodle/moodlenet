import { isEdgeNodeOfType, narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useCallback, useMemo } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { getMaybeAssetRefUrlOrDefaultImage } from '../../../../../helpers/data'
import { href } from '../../../../elements/link'
import { CtrlHook } from '../../../../lib/ctrl'
import {
  useAddProfileRelationMutation,
  useDelProfileRelationMutation,
  useProfilePageUserDataQuery,
} from '../../../../pages/Profile/Ctrl/ProfileCtrl.gen'
import { SmallProfileCardProps } from '../SmallProfileCard'

export type SmallProfileCardCtrlArg = { id: ID }
export const useSmallProfileCardCtrl: CtrlHook<SmallProfileCardProps, SmallProfileCardCtrlArg> = ({ id }) => {
  const { session, isAuthenticated } = useSession()
  const { data, refetch } = useProfilePageUserDataQuery({
    variables: { profileId: id, myProfileId: session ? [session.profile.id] : [] },
  })
  const profileNode = narrowNodeType(['Profile'])(data?.node)
  const isOwner = !!session && !!profileNode && profileNode.id === session.profile.id

  const [addRelation, addRelationRes] = useAddProfileRelationMutation()
  const [delRelation, delRelationRes] = useDelProfileRelationMutation()

  const myFollowEdgeId = profileNode?.myFollow.edges[0]?.edge.id
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

  const collections = useMemo(
    () => (profileNode?.collections.edges || []).filter(isEdgeNodeOfType(['Collection'])).map(({ node }) => node),
    [profileNode?.collections.edges],
  )
  const resources = useMemo(
    () => (profileNode?.resources.edges || []).filter(isEdgeNodeOfType(['Resource'])).map(({ node }) => node),
    [profileNode?.resources.edges],
  )
  const kudos = useMemo(
    () => [...resources, ...collections].reduce((allLikes, { likesCount }) => allLikes + likesCount, 0),
    [collections, resources],
  )
  const SmallProfileCardUIProps = useMemo<SmallProfileCardProps | null>(
    () =>
      profileNode
        ? {
            backgroundUrl: getMaybeAssetRefUrlOrDefaultImage(profileNode.image, id, 'image') ?? '',
            displayName: profileNode.name,
            isFollowing: !!myFollowEdgeId,
            overallCardProps: {
              followers: profileNode.followersCount,
              resources: profileNode.resourcesCount,
              kudos,
              years: 0,
            },
            avatarUrl: getMaybeAssetRefUrlOrDefaultImage(profileNode.avatar, id, 'avatar') ?? '',
            organizationName: 'organizationName',
            toggleFollow,
            username: profileNode.name,
            isVerified: true,
            isAuthenticated,
            isOwner,
            profileHref: href(nodeGqlId2UrlPath(id)),
          }
        : null,
    [profileNode, id, myFollowEdgeId, kudos, toggleFollow, isAuthenticated, isOwner],
  )
  return SmallProfileCardUIProps && [SmallProfileCardUIProps]
}
