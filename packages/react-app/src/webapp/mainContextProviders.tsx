import type { PkgConnection, PkgIdentifier } from '@moodlenet/core'
import type { FC, PropsWithChildren } from 'react'
import { ReactAppMainComponent } from './web-lib.mjs'
import { pkgApis } from './web-lib/pri-http/xhr-adapter/callPkgApis.mjs'

export type PluginMainComponentObject = {
  MainComponent: ReactAppMainComponent<any>
  pkgId: PkgIdentifier
  usesPkgs: PkgConnection<any>[]
}
export const pluginMainComponents: PluginMainComponentObject[] = []

export const ProvideMainContexts: FC<PropsWithChildren<{}>> = ({ children }) => {
  const Main = pluginMainComponents
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

  // const registryProviderWrap = registriesProviders
  //   //.reverse()
  //   .reduce(
  //     (_children, { Provider }, index) => <Provider key={`registriesProvider_${index}`}>{_children}</Provider>,
  //     Main,
  //   )
  // return registryProviderWrap

  return Main
}
