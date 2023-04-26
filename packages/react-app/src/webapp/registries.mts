import { RouteRegItem } from './app-routes.js'

import { SettingsSectionItem } from './context/SettingsContext.js'
import { FooterComponentRegItem } from './ui/components/organisms/Footer/addons.js'
import { HeaderRightComponentRegItem } from './ui/components/organisms/Header/addons.js'
import { GuestRegistryMap, useCreateRegistry } from './web-lib/registry.js'

export type MainRegistries = ReturnType<typeof useMakeRegistries>
export type GuestMainRegistries = GuestRegistryMap<MainRegistries>
export function useMakeRegistries() {
  const headerRightComponents = useCreateRegistry<HeaderRightComponentRegItem>()
  const footerLeftComponents = useCreateRegistry<FooterComponentRegItem>()
  const footerCenterComponents = useCreateRegistry<FooterComponentRegItem>()
  const footerRightComponents = useCreateRegistry<FooterComponentRegItem>()
  const routes = useCreateRegistry<RouteRegItem>()
  const settingsSections = useCreateRegistry<SettingsSectionItem>()
  return {
    headerRightComponents,
    footerLeftComponents,
    footerCenterComponents,
    footerRightComponents,
    routes,
    settingsSections,
  }
}
