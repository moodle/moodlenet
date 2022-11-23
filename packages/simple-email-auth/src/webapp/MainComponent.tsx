import {
  ReactAppMainComponent,
  registries,
  SettingsSectionItem,
} from '@moodlenet/react-app/web-lib'
import * as LoginComponents from './Login/Login.js'
import { LoginPanelContainer } from './Login/LoginContainer.js'
import { useMemo } from 'react'
import { SignUpPanelCtrl } from './SignUpHooks.js'
import Router from './Router.js'
import { Content, Menu } from './Settings.js'
import * as signupComponents from './Signup.js'
import { MainContextT, WebPkgDeps } from './types.mjs'
import { MainContext } from './MainContext.js'

const settingsSectionItem: SettingsSectionItem = { Content, Menu }
const loginItem = { Icon: LoginComponents.Icon, Panel: LoginPanelContainer }
const signUpItem = { Icon: signupComponents.Icon, Panel: SignUpPanelCtrl }
const MainComponent: ReactAppMainComponent<WebPkgDeps> = ({ pkgs, pkgId, children }) => {
  // registries.loginItems.useRegister(pkgId, loginComponents)
  registries.loginItems.useRegister(pkgId, loginItem)
  registries.signupItems.useRegister(pkgId, signUpItem)
  registries.settingsSections.useRegister(pkgId, settingsSectionItem)
  registries.routes.useRegister(pkgId, Router)

  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      pkgs,
      pkgId,
    }
    return ctx
  }, [pkgId, pkgs])
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
const MainComponent: ReactAppMainComponent<WebPkgDeps> = ({ pkgs, pkgId, children }) => {
  registries.loginItems.useRegister(pkgId, loginItem)
  registries.signupItems.useRegister(pkgId, signupComponents)
  registries.settingsSections.useRegister(pkgId, settingsComponents)
  registries.routes.useRegister(pkgId, Router)
  useEffect(() => {
    console.log({ pkgs })
  }, [pkgs])
  useEffect(() => {
    console.log({ pkgId })
  }, [pkgId])
  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      pkgs,
      pkgId,
    }
    return ctx
  }, [pkgId, pkgs])
  // console.log({ mainContext })
  return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
}
export default MainComponent
*/
