import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { PassportAuthExt } from '..'
import type {
  PluginMainComponent,
  ReactAppPluginMainModule,
  WebappPluginMainModule,
  WebAppShellOf,
} from '../../../react-app/dist/root-export.mjs'
import type { PassportConfigs } from '../store/types.js'
import * as settingsComponents from './AdminSettings.js'
import * as loginComponents from './Login.js'
import AuthRoutes from './routes.js'

export type PassportAuthExtWebappPlugin = WebappPluginMainModule<
  PassportAuthExt,
  void,
  [never, ReactAppPluginMainModule, never, never, never, never]
>
type ProviderConfiguredFlags = { [provider in keyof PassportConfigs]?: boolean }
export type PassportContextT = {
  shell: WebAppShellOf<PassportAuthExtWebappPlugin>
  configFlags: ProviderConfiguredFlags
  configs: PassportConfigs
  save(configs: PassportConfigs): Promise<void>
}

export const PassportContext = createContext<PassportContextT>(null as any)

const mainModule: PassportAuthExtWebappPlugin = {
  connect(shell) {
    const [, reactApp] = shell.deps
    reactApp.auth.login.register(loginComponents)
    reactApp.auth.signup.register(loginComponents)
    reactApp.settings.section.register(settingsComponents)
    reactApp.route.register({ routes: AuthRoutes })
    const MainProvider: PluginMainComponent = ({ children }) => {
      const [configs, setConfig] = useState<PassportConfigs>({})
      useEffect(() => {
        shell.http
          .fetch('get')()
          .then(({ configs }) => setConfig(configs))
      }, [])

      const save = useCallback<PassportContextT['save']>(configs => {
        return shell.http
          .fetch('save')({ configs })
          .then(({ configs }) => setConfig(configs))
      }, [])

      const ctx = useMemo<PassportContextT>(() => {
        const configFlags: ProviderConfiguredFlags = {
          google: !!configs.google,
        }
        const _ctx = { shell, configs, configFlags, save }
        return _ctx
      }, [save, configs])

      return <PassportContext.Provider value={ctx}>{children}</PassportContext.Provider>
    }
    return {
      MainComponent: MainProvider,
    }
  },
}
export default mainModule
