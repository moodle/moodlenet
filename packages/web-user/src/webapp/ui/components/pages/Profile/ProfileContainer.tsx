import type { FC } from 'react'
import ProfilePage from './Profile.js'
import { useProfileProps } from './ProfileHooks.js'

export const ProfileContainer: FC<{ profileKey: string }> = ({ profileKey }) => {
  const panelProps = useProfileProps({ profileKey })
  if (!panelProps) {
    return null
  }
  return <ProfilePage {...panelProps} />
}
