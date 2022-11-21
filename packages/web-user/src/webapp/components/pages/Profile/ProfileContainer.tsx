import { FC } from 'react'
import ProfilePage from './Profile.js'
import { useProfileProps } from './ProfileHooks.js'

export const ProfileContainer: FC<{ key: string }> = ({ key }) => {
  const panelProps = useProfileProps({ key })

  return <ProfilePage {...panelProps} />
}
