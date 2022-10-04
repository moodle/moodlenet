import {
  PluginMainComponent,
  ReactAppPluginMainModule,
  WebappPluginMainModule,
  WebAppShellOf,
} from '@moodlenet/react-app'
import { createContext } from 'react'
import { SimpleEmailAuthExt } from '..'
import * as loginComponents from './Login'
import Router from './Router'
import * as settingsComponents from './Settings'
import * as signupComponents from './Signup'

export type SimpleEmailAuthExtWebappPlugin = WebappPluginMainModule<
  SimpleEmailAuthExt,
  void,
  [never, ReactAppPluginMainModule, never, never, never, never, never, never, never]
>

export type MainContextType = {
  shell: WebAppShellOf<SimpleEmailAuthExtWebappPlugin>
}

export const MainContext = createContext<MainContextType>(null as any)

const mainModule: SimpleEmailAuthExtWebappPlugin = {
  connect(shell) {
    const [, reactApp] = shell.deps
    reactApp.auth.login.register(loginComponents)
    reactApp.auth.signup.register(signupComponents)
    reactApp.settings.section.register(settingsComponents)
    reactApp.route.register({ routes: Router })

    const MainComponent: PluginMainComponent = ({ children }) => {
      return <MainContext.Provider value={{ shell }}>{children}</MainContext.Provider>
    }
    return { MainComponent }
  },
}

export default mainModule
