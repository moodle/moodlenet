import { useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { UserSettingsProps } from '../../../ui/exports/ui.mjs'

export const useUserSettingsProps = (): UserSettingsProps => {
  const mainLayoutProps = useMainLayoutProps()
  const userSettingsProps = useMemo<UserSettingsProps>(() => {
    const props: UserSettingsProps = {
      mainLayoutProps,
      settingsItems: [],
    }
    return props
  }, [mainLayoutProps])

  return userSettingsProps
}
