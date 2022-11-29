import { RouteRegItem } from './app-routes.js'
import { SettingsSectionItem } from './context/SettingsContext.js'
import {
  HeaderMenuItemRegItem,
  HeaderRightComponentRegItem,
} from './ui/components/organisms/Header/addons.js'
import { LoginEntryItem, SignupEntryItem } from './web-lib.mjs'
import { createRegistry } from './web-lib/registry.js'

export const rightComponents = createRegistry<HeaderRightComponentRegItem>()
export const routes = createRegistry<RouteRegItem>()
export const avatarMenuItems = createRegistry<HeaderMenuItemRegItem>()
export const addMenuItems = createRegistry<HeaderMenuItemRegItem>()
export const settingsSections = createRegistry<SettingsSectionItem>()
export const loginItems = createRegistry<LoginEntryItem>()
export const signupItems = createRegistry<SignupEntryItem>()
