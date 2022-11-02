import { useMemo } from 'react'
import { ContentGraphProvider } from './components.mjs'
import { MainContext, MainContextT, WebPkgDeps } from './MainContext.js'
import * as registries from './registries.mjs'
import * as set from './ui/components/pages/Settings/SettingsContext.js'
import { ReactAppMainComponent } from './web-lib.mjs'
import * as auth from './web-lib/auth.js'

const MainComponent: ReactAppMainComponent<WebPkgDeps> = ({ pkgs, pkgId, children }) => {
  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      pkgs,
      pkgId,
    }
    return ctx
  }, [])
  // console.log({ mainContext })
  return (
    <registries.loginItems.Provider>
      <registries.signupItems.Provider>
        <registries.avatarMenuItems.Provider>
          <registries.routes.Provider>
            <registries.settingsSections.Provider>
              <registries.rightComponents.Provider>
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
              </registries.rightComponents.Provider>
            </registries.settingsSections.Provider>
          </registries.routes.Provider>
        </registries.avatarMenuItems.Provider>
      </registries.signupItems.Provider>
    </registries.loginItems.Provider>
  )
}
export default MainComponent
