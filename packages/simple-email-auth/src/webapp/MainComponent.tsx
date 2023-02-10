import {
  ReactAppContext,
  ReactAppMainComponent,
  SettingsSectionItem,
  usePkgContext,
} from '@moodlenet/react-app/web-lib'
import { useContext, useMemo } from 'react'
import { MyPkgContext } from '../common/types.mjs'
import * as LoginComponents from './Login/Login.js'
import { LoginPanelContainer } from './Login/LoginContainer.js'
import { MainContext } from './MainContext.js'
import { Content, Menu } from './Settings.js'
import * as signupComponents from './Signup.js'
import { SignUpPanelCtrl } from './SignUpHooks.js'
import { MainContextT } from './types.mjs'

const settingsSectionItem: SettingsSectionItem = { Content, Menu }
const loginItem = { Icon: LoginComponents.Icon, Panel: LoginPanelContainer }
const signUpItem = { Icon: signupComponents.Icon, Panel: SignUpPanelCtrl }
const MainComponent: ReactAppMainComponent = ({ children }) => {
  const myPkgCtx = usePkgContext<MyPkgContext>()
  const { registries } = useContext(ReactAppContext)
  registries.loginItems.useRegister(loginItem)
  registries.signupItems.useRegister(signUpItem)
  registries.settingsSections.useRegister(settingsSectionItem)

  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      ...myPkgCtx,
    }
    return ctx
  }, [myPkgCtx])

  return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
}
export default MainComponent
