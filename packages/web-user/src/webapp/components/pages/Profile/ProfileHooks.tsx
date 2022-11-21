import { useMemo } from 'react'
import { ProfileProps } from './Profile.js'
import { useMainLayoutProps } from '@moodlenet/react-app/ui'
import { useProfileCardProps } from '../../organisms/ProfileCard/ProfileCardHooks.js'

export const useProfileProps = ({ key }: { key: string }): ProfileProps => {
  const profileCardProps = useProfileCardProps({ key })
  const mainLayoutProps = useMainLayoutProps()

  const panelProps = useMemo<ProfileProps>(() => {
    const props: ProfileProps = {
      profileCardProps,
      mainLayoutProps,
    }
    return props
  }, [mainLayoutProps, profileCardProps])

  return panelProps
}
