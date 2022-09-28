import type { PkgConnection, PkgIdentifier } from '@moodlenet/core'
import type { FC, PropsWithChildren } from 'react'
import type { ReactAppMainComponent } from '../types.mjs'
import * as auth from './main-lib/auth.js'
import { pkgApis } from './main-lib/pri-http/xhr-adapter/callPkgApis.mjs'
import { ContentGraphProvider } from './ui/components/pages/ContentGraph/ContentGraphProvider.js'
import * as set from './ui/components/pages/Settings/SettingsContext.js'

export type PluginMainComponent = {
  MainComponent: ReactAppMainComponent<any>
  pkgId: PkgIdentifier
  usesPkgs: PkgConnection<any>[]
}
export const pluginMainComponents: PluginMainComponent[] = []

export const ProvideMainContexts: FC<PropsWithChildren<{}>> = ({ children }) => {
  const MyMainComponent = pluginMainComponents.slice().shift()!
  const ctxProviderWrap = pluginMainComponents
    .slice(1)
    .reverse()
    .reduce((_children, { MainComponent: PluginMainComponent, usesPkgs, pkgId }) => {
      return (
        <PluginMainComponent
          pkgs={usesPkgs.map(wpConn => ({
            call: pkgApis(wpConn),
          }))}
          key={pkgId.name}
        >
          {_children}
        </PluginMainComponent>
      )
    }, <>{children}</>)
  // console.log({ MyMainComponent, pluginMainComponents, ctxProviderWrap })

  const Main = (
    <MyMainComponent.MainComponent
      pkgs={MyMainComponent.usesPkgs.map(wpConn => ({
        call: pkgApis(wpConn),
      }))}
      key={MyMainComponent.pkgId.name}
    >
      <auth.Provider>
        <set.Provider>
          <ContentGraphProvider>
            {/* <I18nProvider i18n={i18n}> */}
            {ctxProviderWrap}
            {/* </I18nProvider> */}
          </ContentGraphProvider>
        </set.Provider>
      </auth.Provider>
    </MyMainComponent.MainComponent>
  )

  // const registryProviderWrap = registriesProviders
  //   //.reverse()
  //   .reduce(
  //     (_children, { Provider }, index) => <Provider key={`registriesProvider_${index}`}>{_children}</Provider>,
  //     Main,
  //   )
  // return registryProviderWrap

  return Main
}
