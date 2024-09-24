import { FallbackContainer } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import { Following } from '../../../ui/exports/ui.mjs'
import { useFollowingPageProps } from './ProfileFollowingPageHook.mjs'

export const ProfileFollowingPageContainer: FC<{ profileKey: string }> = ({ profileKey }) => {
  const followingPageProps = useFollowingPageProps({ profileKey })
  if (followingPageProps === null) return <FallbackContainer />
  else if (followingPageProps === undefined) return null
  return <Following {...followingPageProps} />
}
