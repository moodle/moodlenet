import type { PkgIdentifier } from '@moodlenet/core'
import type { ComponentType, PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { getCurrentInitPkg } from '../../../../../../plugin-initializer.js'
// import { Link } from '../../../../elements/link'
// import { RegistryEntry } from '../../../../main-lib/registry'
import { usePkgAddOns, type RegisterAddOn } from '../../../../../../web-lib/add-ons.js'
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

export type SettingsPagePluginWrapper = ComponentType<PropsWithChildren>
export type SettingsPagePluginHookResult = { MainWrapper?: SettingsPagePluginWrapper }
export type SettingsPagePluginHook = (_: {
  registerAddOn: RegisterAddOn<SettingsSectionItem>
}) => void | SettingsPagePluginHookResult

const settingsPagePluginPlugins: {
  settingsPagePluginHook: SettingsPagePluginHook
  pkgId: PkgIdentifier
}[] = []

export function registerSettingsPagePluginHook(settingsPagePluginHook: SettingsPagePluginHook) {
  const pkgId = getCurrentInitPkg()
  settingsPagePluginPlugins.push({ settingsPagePluginHook, pkgId })
}

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
