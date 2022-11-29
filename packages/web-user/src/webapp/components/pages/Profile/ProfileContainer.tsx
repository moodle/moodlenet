import { FC } from 'react'
import ProfilePage from './Profile.js'
import { useProfileProps } from './ProfileHooks.js'

export const ProfileContainer: FC<{ profileKey: string }> = ({ profileKey }) => {
  const panelProps = useProfileProps({ profileKey })

  return <ProfilePage {...panelProps} />
}
