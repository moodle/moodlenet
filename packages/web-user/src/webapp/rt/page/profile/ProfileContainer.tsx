import { Fallback } from '@moodlenet/react-app/ui'
import { useMainLayoutProps } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import { Profile } from '../../../ui/exports/ui.mjs'
import { useProfileProps } from './ProfileHooks.js'

export const ProfileContainer: FC<{ profileKey: string }> = ({ profileKey }) => {
  const profileProps = useProfileProps({ profileKey })
  const mainLayoutProps = useMainLayoutProps()
  if (profileProps === null) {
    return <Fallback mainLayoutProps={mainLayoutProps} />
  } else if (profileProps === undefined) return null
  return <Profile {...profileProps} key={profileKey} />
}
