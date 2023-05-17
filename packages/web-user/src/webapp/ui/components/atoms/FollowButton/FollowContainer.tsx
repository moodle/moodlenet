import type { FC } from 'react'
import { FollowButton } from './FollowButton.js'
import { useFollowButtonProps } from './FollowButtonHook.js'

export const ProfileContainer: FC<{ profileKey: string }> = ({ profileKey }) => {
  const panelProps = useFollowButtonProps({ profileKey })
  if (!panelProps) {
    return null
  }
  return <FollowButton {...panelProps} />
}
