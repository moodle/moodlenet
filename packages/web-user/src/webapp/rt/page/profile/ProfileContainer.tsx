import { FallbackContainer } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import { Profile } from '../../../ui/exports/ui.mjs'
import { useProfileProps } from './ProfileHooks.js'

export const ProfileContainer: FC<{ profileKey: string }> = ({ profileKey }) => {
  const profileProps = useProfileProps({ profileKey, ownContributionListLimit: 300 })
  if (profileProps === null) {
    return <FallbackContainer />
  } else if (profileProps === undefined) return null
  return <Profile {...profileProps} key={profileKey} />
}
