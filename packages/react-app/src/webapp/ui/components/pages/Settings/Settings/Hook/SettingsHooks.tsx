import { useMemo } from 'react'
// import { Link } from '../../../../elements/link'
// import { RegistryEntry } from '../../../../main-lib/registry'
import { registries } from '../../../../../../web-lib.mjs'
import { useMainLayoutProps } from '../../../../layout/MainLayout/MainLayoutHooks.mjs'
import { AppearanceContainer } from '../../Appearance/GeneralContainer.js'
import { GeneralContainer } from '../../General/GeneralContainer.js'
import { SettingsItem, SettingsProps } from '../Settings.js'

const localSettingsItems: SettingsItem[] = [
  {
    Content: { Item: GeneralContainer, key: `@moodlenet/react-app/general` },
    Menu: { Item: () => <span>General</span>, key: `@moodlenet/react-app/general` },
  },
  {
    Content: { Item: AppearanceContainer, key: `@moodlenet/react-app/appearance` },
    Menu: { Item: () => <span>Appearance</span>, key: `@moodlenet/react-app/appearance` },
  },
]

export const useSettingsProps = (): SettingsProps => {
  const { registry: sectionsReg } = registries.settingsSections.useRegistry()
  const mainLayoutProps = useMainLayoutProps()

  const settingsItems = useMemo<SettingsItem[]>(() => {
    const pkgItems = sectionsReg.entries.map<SettingsItem>(
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
  }, [sectionsReg.entries])

  const settingsProps = useMemo<SettingsProps>(() => {
    return {
      mainLayoutProps,
      settingsItems,
    }
  }, [mainLayoutProps, settingsItems])
  return settingsProps
}
