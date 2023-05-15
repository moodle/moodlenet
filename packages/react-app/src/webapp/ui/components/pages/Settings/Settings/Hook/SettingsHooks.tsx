import type { ComponentType } from 'react'
import { useMemo } from 'react'
// import { Link } from '../../../../elements/link'
// import { RegistryEntry } from '../../../../main-lib/registry'
import { usePkgAddOns } from '../../../../../../web-lib/add-ons.js'
import { useMainLayoutProps } from '../../../../layout/MainLayout/MainLayoutHooks.mjs'
import { AdvancedContainer } from '../../Advanced/AdvancedContainer.js'
import { AppearanceContainer } from '../../Appearance/AppearanceContainer.js'
import { GeneralContainer } from '../../General/GeneralContainer.js'
import type { SettingsItem, SettingsProps } from '../Settings.js'

const localSettingsItems: SettingsItem[] = [
  {
    Content: { Item: GeneralContainer, key: `@moodlenet/react-app/general-settings` },
    Menu: { Item: () => <span>General</span>, key: `@moodlenet/react-app/general-settings` },
  },
  {
    Content: { Item: AppearanceContainer, key: `@moodlenet/react-app/appearance-settings` },
    Menu: { Item: () => <span>Appearance</span>, key: `@moodlenet/react-app/appearance-settings` },
  },
  {
    Content: { Item: AdvancedContainer, key: `@moodlenet/react-app/advanced-settings` },
    Menu: { Item: () => <span>Advanced</span>, key: `@moodlenet/react-app/advanced-settings` },
  },
]
export type SettingsSectionItem = {
  Menu: ComponentType
  Content: ComponentType
}
export const useSettingsProps = (): SettingsProps => {
  const [settingsSections /* , _registerSettingsSection */] =
    usePkgAddOns<SettingsSectionItem>('SettingsSection')

  const mainLayoutProps = useMainLayoutProps()

  const settingsItems = useMemo<SettingsItem[]>(() => {
    const pkgItems = settingsSections.map<SettingsItem>(({ addOn: { Content, Menu }, key }) => {
      const settingsItem: SettingsItem = {
        Content: {
          key,
          Item: Content,
        },
        Menu: {
          key,
          Item: Menu,
        },
      }
      return settingsItem
    })

    return localSettingsItems.concat(pkgItems)
  }, [settingsSections])

  const settingsProps = useMemo<SettingsProps>(() => {
    return {
      mainLayoutProps,
      settingsItems,
    }
  }, [mainLayoutProps, settingsItems])
  return settingsProps
}
