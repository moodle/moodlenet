import { useMemo } from 'react'
import { MainContext, MainContextT } from './context/MainContext.mjs'

import { useMakeRegistries } from './registries.mjs'
import * as set from './context/SettingsContext.js'
import * as auth from './context/AuthContext.js'
import * as Organization from './context/OrganizationCtx.js'
import { ProvideLinkComponentCtx } from './ui.mjs'
import { usePkgContext } from './context/PkgContext.mjs'
import { ReactAppContext, ReactAppContextT } from './context/ReactAppContext.mjs'
import { guestRegistryMap } from './web-lib/registry.js'
import { MyPkgContext } from '../common/my-webapp/types.mjs'
import { ReactAppMainComponent } from './web-lib.mjs'

const MainComponent: ReactAppMainComponent = ({ children }) => {
  const registries = useMakeRegistries()
  const pkgContext = usePkgContext<MyPkgContext>()
  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      ...pkgContext,
      reg: registries,
    }
    return ctx
  }, [registries, pkgContext])

  const exportContext = useMemo<ReactAppContextT>(
    () => ({ registries: guestRegistryMap(registries) }),
    [registries],
  )
  // console.log({ mainContext })
  return (
    <ProvideLinkComponentCtx>
      <MainContext.Provider value={mainContext}>
        <ReactAppContext.Provider value={exportContext}>
          <Organization.Provider>
            <auth.AuthProvider>
              <set.SettingsProvider>
                {/* <I18nProvider i18n={i18n}> */}
                {children}
                {/* </I18nProvider> */}
              </set.SettingsProvider>
            </auth.AuthProvider>
          </Organization.Provider>
        </ReactAppContext.Provider>
      </MainContext.Provider>
    </ProvideLinkComponentCtx>
  )
}
export default MainComponent
