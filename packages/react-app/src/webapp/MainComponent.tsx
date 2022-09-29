import { useMemo } from 'react'
import { MainContext, MainContextT, MyUsesPkgs } from './MainContext.js'
import { ContentGraphProvider } from './ui.mjs'
import * as set from './ui/components/pages/Settings/SettingsContext.js'
import { ReactAppMainComponent } from './web-lib.mjs'
import * as auth from './web-lib/auth.js'

// const routes = createRegistry<RouteRegItem>()
// const avatarMenuItemsReg = createRegistry<HeaderAvatarMenuItemRegItem>()
// const rightComponentsReg = createRegistry<HeaderRightComponentRegItem>()
// const settingsSectionsReg = createRegistry<SettingsSectionItem>()
// const loginItemsReg = createRegistry<LoginItem>()
// const signupItemsReg = createRegistry<SignupItem>()
const MainComponent: ReactAppMainComponent<MyUsesPkgs> = ({ pkgs, children }) => {
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
  return (
    <MainContext.Provider value={mainContext}>
      <auth.Provider>
        <set.Provider>
          <ContentGraphProvider>
            {/* <I18nProvider i18n={i18n}> */}
            {children}
            {/* </I18nProvider> */}
          </ContentGraphProvider>
        </set.Provider>
      </auth.Provider>
    </MainContext.Provider>
  )
}
export default MainComponent
