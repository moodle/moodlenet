import { createContext } from 'react'
import { ReactAppPluginMainModule, WebAppShellOf } from '..'
import { RouteRegItem } from './app-routes'
import { LoginItem, SignupItem } from './main-lib/auth'
import { RegistryHandler } from './main-lib/registry'
import { HeaderAvatarMenuItemRegItem, HeaderRightComponentRegItem } from './ui/components/organisms/Header'
import { SettingsSectionItem } from './ui/components/pages/Settings/SettingsContext'

export type MainContextT = {
  shell: WebAppShellOf<ReactAppPluginMainModule>
  registries: {
    routes: RegistryHandler<RouteRegItem>
    header: {
      avatarMenuItems: RegistryHandler<HeaderAvatarMenuItemRegItem>
      rightComponents: RegistryHandler<HeaderRightComponentRegItem>
    }
    settings: {
      sections: RegistryHandler<SettingsSectionItem>
    }
    auth: {
      login: RegistryHandler<LoginItem>
      signup: RegistryHandler<SignupItem>
    }
  }
}
export const MainContext = createContext<MainContextT>(null as any)
