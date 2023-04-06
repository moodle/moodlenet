import { RouteRegItem } from './app-routes.js'
import { LoginEntryItem, SignupEntryItem } from './context/AuthContext.js'
import { SettingsSectionItem } from './context/SettingsContext.js'
import { FooterComponentRegItem } from './ui/components/organisms/Footer/addons.js'
import {
  HeaderMenuItem,
  HeaderMenuItemRegItem,
  HeaderRightComponentRegItem,
} from './ui/components/organisms/Header/addons.js'
import { GuestRegistryMap, useCreateRegistry } from './web-lib/registry.js'

export type MainRegistries = ReturnType<typeof useMakeRegistries>
export type GuestMainRegistries = GuestRegistryMap<MainRegistries>
export function useMakeRegistries() {
  const rightComponents = useCreateRegistry<HeaderRightComponentRegItem>()
  const footerLeftComponents = useCreateRegistry<FooterComponentRegItem>()
  const footerCenterComponents = useCreateRegistry<FooterComponentRegItem>()
  const footerRightComponents = useCreateRegistry<FooterComponentRegItem>()
  const routes = useCreateRegistry<RouteRegItem>()
  const avatarMenuItems = useCreateRegistry<HeaderMenuItemRegItem>()
  const addMenuItems = useCreateRegistry<HeaderMenuItem>()
  const settingsSections = useCreateRegistry<SettingsSectionItem>()
  const loginItems = useCreateRegistry<LoginEntryItem>()
  const signupItems = useCreateRegistry<SignupEntryItem>()
  return {
    rightComponents,
    footerLeftComponents,
    footerCenterComponents,
    footerRightComponents,
    routes,
    avatarMenuItems,
    addMenuItems,
    settingsSections,
    loginItems,
    signupItems,
  }
}
