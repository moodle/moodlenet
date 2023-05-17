import type { FC } from 'react'
import { LikeButton } from './LikeButton.js'
import { useLikeButtonProps } from './LikeButtonHook.js'

export const ProfileContainer: FC<{ profileKey: string }> = ({ profileKey }) => {
  const panelProps = useLikeButtonProps({ profileKey })
  if (!panelProps) {
    return null
  }
  return <LikeButton {...panelProps} />
}
