import { RouteRegItem } from './app-routes.js'
import { SettingsSectionItem } from './components.mjs'
import {
  HeaderMenuItemRegItem,
  HeaderRightComponentRegItem,
} from './ui/components/organisms/Header/addons.js'
import { LoginItem, SignupItem } from './web-lib.mjs'
import { createRegistry } from './web-lib/registry.js'

export const rightComponents = createRegistry<HeaderRightComponentRegItem>()
export const routes = createRegistry<RouteRegItem>()
export const avatarMenuItems = createRegistry<HeaderMenuItemRegItem>()
export const addMenuItems = createRegistry<HeaderMenuItemRegItem>()
export const settingsSections = createRegistry<SettingsSectionItem>()
export const loginItems = createRegistry<LoginItem>()
export const signupItems = createRegistry<SignupItem>()
