import { useMemo } from 'react'
import { ProfileProps } from './Profile.js'
import { useMainLayoutProps } from '@moodlenet/react-app/ui'
import { useProfileCardProps } from '../../organisms/ProfileCard/ProfileCardHooks.js'

export const useProfileProps = ({ profileKey }: { profileKey: string }): ProfileProps => {
  const profileCardProps = useProfileCardProps({ profileKey })
  const mainLayoutProps = useMainLayoutProps()
  const profileProps = useMemo<ProfileProps>(() => {
    const props: ProfileProps = {
      profileCardProps,
      mainLayoutProps,
    }
    return props
  }, [mainLayoutProps, profileCardProps])

  return profileProps
}
