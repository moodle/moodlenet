import {
  isEdgeNodeOfType,
  narrowNodeType,
} from '@moodlenet/common/dist/graphql/helpers'
import { ID } from '@moodlenet/common/dist/graphql/scalars.graphql'
import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useCallback, useMemo } from 'react'
import { useLocalInstance } from '../../../../../../context/Global/LocalInstance'
import { useSession } from '../../../../../../context/Global/Session'
import { getMaybeAssetRefUrl } from '../../../../../../helpers/data'
import { mainPath } from '../../../../../../hooks/glob/nav'
import { href } from '../../../../../elements/link'
import { CtrlHook } from '../../../../../lib/ctrl'
import {
  useAddProfileRelationMutation,
  useDelProfileRelationMutation,
  useProfilePageUserDataQuery,
} from '../../../../pages/Profile/Ctrl/ProfileCtrl.gen'
import { SmallProfileCardProps } from '../SmallProfileCard'

export type SmallProfileCardCtrlArg = { id: ID }
export const useSmallProfileCardCtrl: CtrlHook<
  SmallProfileCardProps,
  SmallProfileCardCtrlArg
> = ({ id }) => {
  const { session, isAuthenticated } = useSession()
  const { org } = useLocalInstance()
  const { data, refetch } = useProfilePageUserDataQuery({
    variables: {
      profileId: id,
      myProfileId: session ? [session.profile.id] : [],
    },
    fetchPolicy: 'cache-and-network',
  })
  const profileNode = narrowNodeType(['Profile'])(data?.node)
  const isOwner =
    !!session && !!profileNode && profileNode.id === session.profile.id

  const [addRelation, addRelationRes] = useAddProfileRelationMutation()
  const [delRelation, delRelationRes] = useDelProfileRelationMutation()

  const myFollowEdgeId = profileNode?.myFollow.edges[0]?.edge.id
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

  const collections = useMemo(
    () =>
      (profileNode?.collections.edges || [])
        .filter(isEdgeNodeOfType(['Collection']))
        .map(({ node }) => node),
    [profileNode?.collections.edges]
  )
  const resources = useMemo(
    () =>
      (profileNode?.resources.edges || [])
        .filter(isEdgeNodeOfType(['Resource']))
        .map(({ node }) => node),
    [profileNode?.resources.edges]
  )
  const kudos = useMemo(
    () =>
      [...resources, ...collections].reduce(
        (allLikes, { likesCount }) => allLikes + likesCount,
        0
      ),
    [collections, resources]
  )

  const SmallProfileCardUIProps = useMemo<SmallProfileCardProps | null>(
    () =>
      profileNode
        ? {
            backgroundUrl: getMaybeAssetRefUrl(profileNode.image),
            displayName: profileNode.name,
            isFollowing: !!myFollowEdgeId,
            overallCardProps: {
              followers: profileNode.followersCount,
              resources: profileNode.resourcesCount,
              kudos,
              years: 0,
              followersHref: href(
                mainPath.followers({ nodeId: profileNode.id })
              ),
            },
            avatarUrl: getMaybeAssetRefUrl(profileNode.avatar),
            organizationName: org.name,
            toggleFollow,
            username: profileNode.name,
            isVerified: true,
            isAuthenticated,
            isOwner,
            profileHref: href(nodeGqlId2UrlPath(id)),
          }
        : null,
    [
      profileNode,
      id,
      myFollowEdgeId,
      kudos,
      org.name,
      toggleFollow,
      isAuthenticated,
      isOwner,
    ]
  )
  return SmallProfileCardUIProps && [SmallProfileCardUIProps]
}
