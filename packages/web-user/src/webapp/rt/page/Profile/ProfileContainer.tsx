import type { FC } from 'react'
import { Profile } from '../../../ui/exports/ui.mjs'
import { useProfileProps } from './ProfileHooks.js'

export const ProfileContainer: FC<{ profileKey: string }> = ({ profileKey }) => {
  const panelProps = useProfileProps({ profileKey })
  if (!panelProps) {
    return null
  }
  return <Profile {...panelProps} />
}
