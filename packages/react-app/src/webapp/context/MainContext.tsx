import type authConn from '@moodlenet/authentication-manager'
import type graphConnT from '@moodlenet/content-graph'
import type organizationConn from '@moodlenet/organization'
import { createContext } from 'react'
import reactAppConn from '../../main.mjs'
import { ReactAppMainComponentProps } from '.,/web-lib.mjs'
// import { RegistryHandler } from './main-lib/registry'
const graphConnMod = await import('@moodlenet/content-graph')
import type organizationConn from '@moodlenet/organization'

const loadPlugin = async (name: string) => {
  try {
    const plg = await import(name)
    return plg
  } catch (e){
    console.error('plugin not found')
    return null
  }
}

const aaa =await loadPlugin()

const from '@moodlenet/authentication-manager'
typeof authConn 
type graphConn = typeof graphConnMod.default


export type WebPkgDeps = [typeof reactAppConn, typeof organizationConn, typeof authConn, graphConn]
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
