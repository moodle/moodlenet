import { useEffect, useMemo } from 'react'
import { MainContext, MainContextT } from './context/MainContext.mjs'

import { MyPkgContext } from '../common/my-webapp/types.mjs'
import * as auth from './context/AuthContext.js'
import * as Organization from './context/OrganizationCtx.js'
import { usePkgContext } from './context/PkgContext.mjs'
import { ReactAppContext, ReactAppContextT } from './context/ReactAppContext.mjs'
import * as set from './context/SettingsContext.js'
import { useMakeRegistries } from './registries.mjs'
import SetupComponent from './SetupComponent.js'
import { ProvideLinkComponentCtx } from './ui.mjs'
import { ReactAppMainComponent } from './web-lib.mjs'
import { guestRegistryMap } from './web-lib/registry.js'

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
  useEffect(() => {
    pkgContext.use.organization.rpc['__________REMOVE_ME__test_rpcFiles/:id/aa'](
      {
        a: '112',
        b: [
          new File(new Array(12).fill(1), `/a/b/bin`, {
            // type: 'application/json',
          }),
        ],
      },
      { id: 'xxx' },
      { by: 'byeby' },
    ).then(
      ({ a, b: [{ name, size, type }] }) => console.log({ a, name, size, type }),
      console.error,
    )
  }, [pkgContext.use.organization.rpc])
  return (
    <ProvideLinkComponentCtx>
      <MainContext.Provider value={mainContext}>
        <ReactAppContext.Provider value={exportContext}>
          <Organization.Provider>
            <auth.AuthProvider>
              <set.SettingsProvider>
                {/* <I18nProvider i18n={i18n}> */}
                <SetupComponent>{children}</SetupComponent>
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
