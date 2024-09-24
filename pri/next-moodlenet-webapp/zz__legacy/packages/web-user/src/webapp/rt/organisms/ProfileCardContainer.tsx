import type { FC } from 'react'
import { ProfileCard } from '../../ui/exports/ui.mjs'
import { useProfileCardProps } from './ProfileCardHooks'

export const ProfileCardContainer: FC<{ profileKey: string }> = ({ profileKey }) => {
  const opt = useProfileCardProps(profileKey)
  return opt && <ProfileCard {...opt} />
}
