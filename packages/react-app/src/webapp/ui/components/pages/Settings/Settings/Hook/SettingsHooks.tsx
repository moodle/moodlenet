import { useMemo } from 'react'
// import { Link } from '../../../../elements/link'
// import { RegistryEntry } from '../../../../main-lib/registry'
import { createHookPlugin } from '../../../../../../web-lib/plugins.mjs'
import { useMainLayoutProps } from '../../../../layout/MainLayout/MainLayoutHooks.mjs'
import { AdvancedContainer } from '../../Advanced/AdvancedContainer.js'
import { AppearanceContainer } from '../../Appearance/AppearanceContainer.js'
import { GeneralContainer } from '../../General/GeneralContainer.js'
import type { SettingsItem, SettingsProps } from '../Settings.js'

export type SettingsSectionItem = Omit<SettingsItem, 'key'>
const localSettingsItems: SettingsItem[] = [
  {
    key: `@moodlenet/react-app/general-settings`,
    Content: GeneralContainer,
    Menu: () => <span>General</span>,
  },
  {
    key: `@moodlenet/react-app/appearance-settings`,
    Content: AppearanceContainer,
    Menu: () => <span>Appearance</span>,
  },
  {
    key: `@moodlenet/react-app/advanced-settings`,
    Content: AdvancedContainer,
    Menu: () => <span>Advanced</span>,
  },
]

export const SettingsPagePlugins = createHookPlugin<{
  settingsSection: SettingsSectionItem
}>({ settingsSection: null })

export const useSettingsProps = (): SettingsProps => {
  const [addons] = SettingsPagePlugins.useHookPlugin()
  const mainLayoutProps = useMainLayoutProps()

  const settingsItems = useMemo<SettingsItem[]>(() => {
    return localSettingsItems.concat(addons.settingsSection)
  }, [addons.settingsSection])

  const settingsProps = useMemo<SettingsProps>(() => {
    return {
      mainLayoutProps,
      settingsItems,
    }
  }, [mainLayoutProps, settingsItems])
  return settingsProps
}
