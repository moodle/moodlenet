import { FallbackContainer } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import { Followers } from '../../../ui/exports/ui.mjs'
import { useProfileFollowersPageProps } from './ProfileFollowersPageHook.mjs'

export const ProfileFollowersPageContainer: FC<{ profileKey: string }> = ({ profileKey }) => {
  const followersPageProps = useProfileFollowersPageProps({ profileKey })
  if (followersPageProps === null) return <FallbackContainer />
  else if (followersPageProps === undefined) return null
  return <Followers {...followersPageProps} />
}
