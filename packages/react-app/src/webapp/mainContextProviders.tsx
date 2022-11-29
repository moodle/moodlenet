import { PkgIdentifier } from '@moodlenet/core'
import { FC, PropsWithChildren, useMemo } from 'react'
import _connect from '_connect-moodlenet-pkg-modules_'
import { WebPkgDepList } from './types/plugins.mjs'
import { ReactAppMainComponent } from './web-lib.mjs'
import { pkgApis } from './web-lib/pri-http/xhr-adapter/callPkgApis.mjs'

const connect = getConnect()

export const ProvideMainContexts: FC<PropsWithChildren> = ({ children }) => {
  const Main = useMemo(
    () =>
      connect.pkgs.reduce((_children, { MainComponent: PluginMainComponent, usesPkgs, pkgId }) => {
        return (
          <PluginMainComponent
            pkgs={usesPkgs.map(wpConn => ({
              call: pkgApis(wpConn),
            }))}
            pkgId={pkgId}
            key={`${pkgId.name}@${pkgId.version}`}
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
    MainComponent: ReactAppMainComponent
    pkgId: PkgIdentifier
    usesPkgs: WebPkgDepList
  }
  type Connect = {
    pkgs: PluginMainComponentObject[]
  }
  const connect: Connect = {
    ..._connect,
    pkgs: _connect.pkgs.slice().reverse(),
  }
  _connect.pkgs.length = 0
  _connect.pkgs = null
  return connect
}
