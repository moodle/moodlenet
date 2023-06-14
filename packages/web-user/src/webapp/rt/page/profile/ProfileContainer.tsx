import type { FC } from 'react'
import { Profile } from '../../../ui/exports/ui.mjs'
import { useProfileProps } from './ProfileHooks.js'

export const ProfileContainer: FC<{ profileKey: string }> = ({ profileKey }) => {
  const profileProps = useProfileProps({ profileKey })
  if (!profileProps) {
    return null
  }
  return <Profile {...profileProps} key={profileKey} />
}
