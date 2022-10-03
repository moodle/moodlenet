import { ReactAppMainComponent, registries } from '@moodlenet/react-app/web-lib.mjs'
import { createContext, useMemo } from 'react'
import * as loginComponents from './Login.js'
import Router from './Router.js'
import * as settingsComponents from './Settings.js'
import * as signupComponents from './Signup.js'
import { MainContextT, WebPkgDeps } from './types.mjs'

export const MainContext = createContext<MainContextT>(null as any)
const MainComponent: ReactAppMainComponent<WebPkgDeps> = ({ pkgs, pkgId, children }) => {
  registries.loginItems.useRegister(pkgId, loginComponents)
  registries.signupItems.useRegister(pkgId, signupComponents)
  registries.settingsSections.useRegister(pkgId, settingsComponents)
  registries.routes.useRegister(pkgId, Router)
  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      pkgs,
      pkgId,
    }
    return ctx
  }, [])
  // console.log({ mainContext })
  return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
}
export default MainComponent
