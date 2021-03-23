import { EdgeType, Id, NodeType } from '@moodlenet/common/lib/utils/content-graph'
import { FC, useMemo } from 'react'
import { useSession } from '../../contexts/Global/Session'
import { getRelCount } from '../../helpers/nodeMeta'
import { getUsePageHeaderProps } from '../../hooks/useProps/PageHeader'
import { ProfilePage, ProfilePageProps } from '../../ui/pages/Profile'
import {
  // useProfilePageFollowMutation,
  useProfilePageNodeQuery,
} from './ProfilePage/ProfilePage.gen'

export const ProfilePageComponent: FC<{ id: Id }> = ({ id }) => {
  const { session } = useSession()

  const nodeRes = useProfilePageNodeQuery({
    variables: { id, followable: !!session?.profile && id !== session.profile._id },
  })
  const profile = nodeRes.data?.node
  if (profile && profile.__typename !== 'Profile') {
    throw new Error('never')
  }

  // const [follow /* , followResp */] = useProfilePageFollowMutation()
  // const [unfollow /* , unfollowResp */] = useProfilePageUnfollowMutation()
  const usePageHeaderProps = getUsePageHeaderProps()
  const props = useMemo<ProfilePageProps | null>(() => {
    // const myFollowId = profile?.myFollow.edges[0]?.edge._id

    return profile
      ? {
          icon: profile.icon || '',
          followers: getRelCount(profile._meta, EdgeType.Follows, 'from', NodeType.Profile),
          me: /* session?.profile
            ? {
                toggleFollow() {
                  if (!session?.profile) {
                    return
                  }
                  myFollowId
                    ? unfollow({ variables: { edgeId: myFollowId } })
                    : follow({ variables: { profileId: id, currentProfileId: session.profile._id } })
                },
                following: !!myFollowId,
              }
            : */ null,
          name: profile.name,
          usePageHeaderProps,
        }
      : null
  }, [profile, usePageHeaderProps])
  return props && <ProfilePage {...props} />
}
