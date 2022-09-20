import {
  PluginMainComponent,
  ReactAppPluginMainModule,
  WebappPluginMainModule,
  WebAppShellOf,
} from '@moodlenet/react-app'
import { createContext } from 'react'
import { WebUserExt } from '..'
import * as headerComponents from './Header'

export type WebUserExtWebappPlugin = WebappPluginMainModule<WebUserExt, void, [never, ReactAppPluginMainModule, never]>

export type MainContextType = {
  shell: WebAppShellOf<WebUserExtWebappPlugin>
}

export const MainContext = createContext<MainContextType>(null as any)

const mainModule: WebUserExtWebappPlugin = {
  connect(shell) {
    const [, reactApp] = shell.deps
    reactApp.header.avatarMenuItem.register(headerComponents)

    const MainComponent: PluginMainComponent = ({ children }) => {
      // console.log({ ct: cg })
      return <MainContext.Provider value={{ shell }}>{children}</MainContext.Provider>
    }
    return { MainComponent }
  },
}

// const ProfilePageWrap: NodeHomePageComponent<{ _kind: 'node'; _type: 'at__moodlenet__web-user__Profile' }> = ({
//   node: { /* description,  */ title },
// }) => {
//   return <ProfilePage displayName={title} />
// }

export default mainModule
