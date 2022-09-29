import type { PkgConnection, PkgIdentifier } from '@moodlenet/core'
import { FC, PropsWithChildren, useMemo } from 'react'
import _connect from '_connect-moodlenet-pkg-modules_'
import { ReactAppMainComponent } from './web-lib.mjs'
import { pkgApis } from './web-lib/pri-http/xhr-adapter/callPkgApis.mjs'

const connect = getConnect()

export const ProvideMainContexts: FC<PropsWithChildren<{}>> = ({ children }) => {
  const Main = useMemo(
    () =>
      connect.pkgs.reverse().reduce((_children, { MainComponent: PluginMainComponent, usesPkgs, pkgId }) => {
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
      }, <>{children}</>),
    [children],
  )
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

function getConnect() {
  type PluginMainComponentObject = {
    MainComponent: ReactAppMainComponent<any>
    pkgId: PkgIdentifier
    usesPkgs: PkgConnection<any>[]
  }
  type Connect = {
    pkgs: PluginMainComponentObject[]
  }
  const connect: Connect = {
    ..._connect,
    pkgs: _connect.slice(),
  }
  _connect.pkgs.length = 0
  _connect.pkgs = null
  return connect
}
