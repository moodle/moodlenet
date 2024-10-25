import type { AddOnMap } from '@moodlenet/core/lib'
import { useMemo } from 'react'
import { createPlugin } from '../../../../../web-lib/create-plugin.mjs'
// import { Link } from '../../../../elements/link'
// import { RegistryEntry } from '../../../../main-lib/registry'
import { useMainLayoutProps } from '../../../layout/MainLayout/MainLayoutHooks.mjs'
import type { AdminSettingsItem, AdminSettingsProps } from '../AdminSettings'
import { AppearanceContainer } from '../Appearance/AppearanceContainer'
import { GeneralContainer } from '../General/GeneralContainer'

export type AdminSettingsSectionItem = Omit<AdminSettingsItem, 'key'>
const localAdminSettingsItems: AdminSettingsItem[] = [
  {
    key: `@moodlenet/react-app/general-admin-settings`,
    Content: GeneralContainer,
    Menu: () => <span>General</span>,
  },
  {
    key: `@moodlenet/react-app/appearance-admin-settings`,
    Content: AppearanceContainer,
    Menu: () => <span>Appearance</span>,
  },
  // {
  //   key: `@moodlenet/react-app/advanced-admin-settings`,
  //   Content: AdvancedContainer,
  //   Menu: () => <span>Advanced</span>,
  // },
]

export const AdminSettingsPagePlugins = createPlugin<{
  adminSettingsSection?: AddOnMap<AdminSettingsSectionItem>
  denyAccess?: boolean
}>()

export const useAdminSettingsProps = (): {
  adminSettingsProps: AdminSettingsProps
  denyAccess: boolean
} => {
  const plugins = AdminSettingsPagePlugins.usePluginHooks()
  const mainLayoutProps = useMainLayoutProps()

  const settingsItems = useMemo<AdminSettingsItem[]>(() => {
    return localAdminSettingsItems.concat(plugins.getKeyedAddons('adminSettingsSection'))
  }, [plugins])

  const denyAccess = plugins.results.map(({ result: { denyAccess } }) => denyAccess).includes(true)
  const adminSettings = useMemo(() => {
    const adminSettingsProps: AdminSettingsProps = {
      mainLayoutProps,
      settingsItems,
    }
    return { adminSettingsProps, denyAccess }
  }, [mainLayoutProps, settingsItems, denyAccess])
  return adminSettings
}
