import {
  ReactAppContext,
  ReactAppMainComponent,
  SettingsSectionItem,
  usePkgContext,
} from '@moodlenet/react-app/web-lib'
import * as LoginComponents from './Login/Login.js'
import { LoginPanelContainer } from './Login/LoginContainer.js'
import { useContext, useMemo } from 'react'
import { SignUpPanelCtrl } from './SignUpHooks.js'
import Router from './Router.js'
import { Content, Menu } from './Settings.js'
import * as signupComponents from './Signup.js'
import { MainContextT } from './types.mjs'
import { MainContext } from './MainContext.js'
import { MyPkgContext } from '../common/types.mjs'

const settingsSectionItem: SettingsSectionItem = { Content, Menu }
const loginItem = { Icon: LoginComponents.Icon, Panel: LoginPanelContainer }
const signUpItem = { Icon: signupComponents.Icon, Panel: SignUpPanelCtrl }
const MainComponent: ReactAppMainComponent = ({ children }) => {
  const myPkgCtx = usePkgContext<MyPkgContext>()
  const { registries } = useContext(ReactAppContext)
  registries.loginItems.useRegister(loginItem)
  registries.signupItems.useRegister(signUpItem)
  registries.settingsSections.useRegister(settingsSectionItem)
  registries.routes.useRegister(Router)

  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      ...myPkgCtx,
    }
    return ctx
  }, [myPkgCtx])
  // console.log({ mainContext })
  return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
}
export default MainComponent

/*

import { ReactAppMainComponent, registries } from '@moodlenet/react-app/web-lib.mjs'
import { createContext, useEffect, useMemo } from 'react'
import * as LoginComponents from './Login.js'
import { LoginPanelCtrl } from './LoginCtrl.js'

import Router from './Router.js'
import * as settingsComponents from './Settings.js'
import * as signupComponents from './Signup.js'
import { MainContextT, WebPkgDeps } from './types.mjs'

const loginItem = { Icon: LoginComponents.Icon, Panel: LoginPanelCtrl }
export const MainContext = createContext<MainContextT>(null as any)
const MainComponent: ReactAppMainComponent<WebPkgDeps> = ({ pkgs,  children }) => {
  registries.loginItems.useRegister( loginItem)
  registries.signupItems.useRegister( signupComponents)
  registries.settingsSections.useRegister( settingsComponents)
  registries.routes.useRegister( Router)
  useEffect(() => {
    console.log({ pkgs })
  }, [pkgs])
  useEffect(() => {
    console.log({ pkgId })
  }, [pkgId])
  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      pkgs,
      
    }
    return ctx
  }, [ pkgs])
  // console.log({ mainContext })
  return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
}
export default MainComponent
*/
