import type { AddOnMap } from '@moodlenet/core/lib'
import { createPluginHook, useMainLayoutProps } from '@moodlenet/react-app/webapp'
import type { UserSettingsItem, UserSettingsProps } from '../../../ui/exports/ui.mjs'

export const UserSettingsPagePlugin = createPluginHook<{
  settingsItems: AddOnMap<Omit<UserSettingsItem, 'key'>>
}>()

export const useUserSettingsProps = (): UserSettingsProps => {
  const plugins = UserSettingsPagePlugin.usePluginHooks()
  const mainLayoutProps = useMainLayoutProps()
  const userSettingsProps: UserSettingsProps = {
    mainLayoutProps,
    settingsItems: plugins.getKeyedAddons('settingsItems'),
  }
  return userSettingsProps
}
