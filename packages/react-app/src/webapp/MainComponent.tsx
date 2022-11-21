import { useMemo } from 'react'
import { ContentGraphProvider } from './components.mjs'
import { MainContext, MainContextT } from './context/MainContext.js'
import * as registries from './registries.mjs'
import * as set from './context/SettingsContext.js'
import { ReactAppMainComponent } from './web-lib.mjs'
import * as auth from './context/auth.js'
import * as Organization from './context/OrganizationCtx.js'
import { WebPkgDeps } from '../common/types.mjs'
import { ProvideLinkComponentCtx } from './ui.mjs'

const MainComponent: ReactAppMainComponent<WebPkgDeps> = ({ pkgs, pkgId, children }) => {
  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      pkgs,
      pkgId,
    }
    return ctx
  }, [pkgId, pkgs])
  // console.log({ mainContext })
  return (
    <registries.loginItems.Provider>
      <registries.signupItems.Provider>
        <registries.avatarMenuItems.Provider>
          <registries.routes.Provider>
            <registries.settingsSections.Provider>
              <registries.rightComponents.Provider>
                <ProvideLinkComponentCtx>
                  <MainContext.Provider value={mainContext}>
                    <Organization.Provider>
                      <auth.AuthProvider>
                        <set.SettingsProvider>
                          <ContentGraphProvider>
                            {/* <I18nProvider i18n={i18n}> */}
                            {children}
                            {/* </I18nProvider> */}
                          </ContentGraphProvider>
                        </set.SettingsProvider>
                      </auth.AuthProvider>
                    </Organization.Provider>
                  </MainContext.Provider>
                </ProvideLinkComponentCtx>
              </registries.rightComponents.Provider>
            </registries.settingsSections.Provider>
          </registries.routes.Provider>
        </registries.avatarMenuItems.Provider>
      </registries.signupItems.Provider>
    </registries.loginItems.Provider>
  )
}
export default MainComponent
