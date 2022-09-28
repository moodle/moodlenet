import { useMemo } from 'react'
import { ReactAppMainComponent } from '../types.mjs'
import { MainContext, MainContextT, MyUsesPkgs } from './MainContext.js'

// const routes = createRegistry<RouteRegItem>()
// const avatarMenuItemsReg = createRegistry<HeaderAvatarMenuItemRegItem>()
// const rightComponentsReg = createRegistry<HeaderRightComponentRegItem>()
// const settingsSectionsReg = createRegistry<SettingsSectionItem>()
// const loginItemsReg = createRegistry<LoginItem>()
// const signupItemsReg = createRegistry<SignupItem>()
const MainComponent: ReactAppMainComponent<MyUsesPkgs> = ({ pkgs, children }) => {
  // console.log({ ciccio: pkgs })
  // const [reactAppPkg, organizationPkg] = pkgs
  // reactAppPkg.call('getAppearance')().then(console.log)
  // organizationPkg.call('getOrgData')().then(console.log)
  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      pkgs,
    }
    return ctx
  }, [])
  // console.log({ mainContext })
  return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
}
export default MainComponent
