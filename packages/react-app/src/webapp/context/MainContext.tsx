import { createContext } from 'react'
import { WebPkgDeps } from '../../main.mjs'
import { ReactAppMainComponentProps } from '../web-lib.mjs'
// import { ReactAppMainComponentProps } from '.,/web'
// import { RegistryHandler } from './main-lib/registry'

export type MainContextT = ReactAppMainComponentProps<WebPkgDeps> & {
  // shell: WebAppShellOf<ReactAppPluginMainModule>
  // registries: {
  //   routes: RegistryHandler<RouteRegItem>
  //   header: {
  //     avatarMenuItems: RegistryHandler<HeaderAvatarMenuItemRegItem>
  //     rightComponents: RegistryHandler<HeaderRightComponentRegItem>
  //   }
  //   settings: {
  //     sections: RegistryHandler<SettingsSectionItem>
  //   }
  //   auth: {
  //     login: RegistryHandler<LoginItem>
  //     signup: RegistryHandler<SignupItem>
  //   }
  // }
}
export const MainContext = createContext<MainContextT>(null as any)
