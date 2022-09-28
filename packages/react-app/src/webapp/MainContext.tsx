import type authConn from '@moodlenet/authentication-manager'
import type graphConn from '@moodlenet/content-graph'
import type organizationConn from '@moodlenet/organization'
import { createContext } from 'react'
import reactAppConn from '../main.mjs'
import { ReactAppMainComponentProps } from '../types.mjs'
// import { RegistryHandler } from './main-lib/registry'

export type MyUsesPkgs = [typeof reactAppConn, typeof organizationConn, typeof authConn, typeof graphConn]
export type MainContextT = ReactAppMainComponentProps<MyUsesPkgs> & {
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
