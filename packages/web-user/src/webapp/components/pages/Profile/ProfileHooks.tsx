import { FC, useCallback, useContext, useMemo, useState } from 'react'
import ProfilePage, { ProfileProps } from './Profile.js'
import { useMainLayoutProps } from '@moodlenet/react-app/ui'
import { useProfileCardProps } from '../../organisms/ProfileCard/ProfileCardHooks.js'

export const useProfileProps = (): ProfileProps => {
  const profileCardProps = useProfileCardProps()

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

export const ProfileCtrl: FC = () => {
  const panelProps = useProfileProps()

  return <ProfilePage {...panelProps} />
}
