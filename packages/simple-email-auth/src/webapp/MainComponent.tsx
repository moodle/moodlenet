import type { ReactAppMainComponent, SettingsSectionItem } from '@moodlenet/react-app/webapp'
import { ReactAppContext, usePkgContext } from '@moodlenet/react-app/webapp'
import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext, useMemo } from 'react'
import type { MyPkgContext } from '../common/types.mjs'
import { MainContext } from './MainContext.mjs'
import type { MainContextT } from './types.mjs'
import * as LoginComponents from './ui/Login/Login.js'
import { LoginPanelContainer } from './ui/Login/LoginContainer.js'
import { SettingsContent, SettingsMenu } from './ui/Settings.js'
import * as signupComponents from './ui/Signup/Signup.js'
import { SignUpPanelCtrl } from './ui/Signup/SignUpHooks.js'

const settingsSectionItem: SettingsSectionItem = { Content: SettingsContent, Menu: SettingsMenu }
const loginItem = { Icon: LoginComponents.LoginIcon, Panel: LoginPanelContainer }
const signUpItem = { Icon: signupComponents.SignupIcon, Panel: SignUpPanelCtrl }
const MainComponent: ReactAppMainComponent = ({ children }) => {
  const myPkgCtx = usePkgContext<MyPkgContext>()
  const reactAppCtx = useContext(ReactAppContext)
  const webUserCtx = useContext(AuthCtx)
  webUserCtx.registries.loginItems.useRegister(loginItem)
  webUserCtx.registries.signupItems.useRegister(signUpItem)
  reactAppCtx.registries.settingsSections.useRegister(settingsSectionItem)

  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      ...myPkgCtx,
    }
    return ctx
  }, [myPkgCtx])

  return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
}
export default MainComponent
