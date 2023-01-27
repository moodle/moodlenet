import { useContext, useMemo } from 'react'
// import { Link } from '../../../../elements/link'
// import { RegistryEntry } from '../../../../main-lib/registry'
import { MainContext } from '../../../../../../context/MainContext.mjs'
import { useMainLayoutProps } from '../../../../layout/MainLayout/MainLayoutHooks.mjs'
import { AdvancedContainer } from '../../Advanced/AdvancedContainer.js'
import { AppearanceContainer } from '../../Appearance/AppearanceContainer.js'
import { GeneralContainer } from '../../General/GeneralContainer.js'
import { SettingsItem, SettingsProps } from '../Settings.js'

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

export const useSettingsProps = (): SettingsProps => {
  const { reg } = useContext(MainContext)
  const mainLayoutProps = useMainLayoutProps()

  const settingsItems = useMemo<SettingsItem[]>(() => {
    const pkgItems = reg.settingsSections.registry.entries.map<SettingsItem>(
      ({ item: { Content, Menu }, pkgId }, index) => {
        const key = `${pkgId.name}/${index}`
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
      },
    )

    return localSettingsItems.concat(pkgItems)
  }, [reg.settingsSections.registry])

  const settingsProps = useMemo<SettingsProps>(() => {
    return {
      mainLayoutProps,
      settingsItems,
    }
  }, [mainLayoutProps, settingsItems])
  return settingsProps
}
