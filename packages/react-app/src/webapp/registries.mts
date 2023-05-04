import type { RouteRegItem } from './app-routes.js'

import type { SettingsSectionItem } from './context/SettingsContext.js'
import type { FooterComponentRegItem } from './ui/components/organisms/Footer/addons.js'
import type { HeaderRightComponentRegItem } from './ui/components/organisms/Header/addons.js'
import type { GuestRegistryMap } from './web-lib/registry.js'
import { useCreateRegistry } from './web-lib/registry.js'

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
