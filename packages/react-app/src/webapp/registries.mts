import { RouteRegItem } from './app-routes.js'
import { HeaderAvatarMenuItemRegItem, HeaderRightComponentRegItem, SettingsSectionItem } from './ui.mjs'
import { LoginItem, SignupItem } from './web-lib.mjs'
import { createRegistry } from './web-lib/registry.js'

export const rightComponents = createRegistry<HeaderRightComponentRegItem>()
export const routes = createRegistry<RouteRegItem>()
export const avatarMenuItems = createRegistry<HeaderAvatarMenuItemRegItem>()
export const settingsSections = createRegistry<SettingsSectionItem>()
export const loginItems = createRegistry<LoginItem>()
export const signupItems = createRegistry<SignupItem>()
