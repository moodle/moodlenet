import { PkgIdentifier } from '@moodlenet/core'
import { FC, PropsWithChildren, useMemo } from 'react'
import _connect from '_connect-moodlenet-pkg-modules_'
import { WebPkgDeps } from '../common/types.mjs'
import { PkgContext } from './context/PkgContext.mjs'
import { ReactAppMainComponent } from './web-lib.mjs'
import { getUseUsePkgHandle } from './web-lib/pri-http/xhr-adapter/callPkgApis.mjs'

const plugins = getPlugins()

export const PkgMainComponentsWrap: FC<PropsWithChildren> = ({ children }) => {
  const Main = useMemo(
    () =>
      plugins.pkgs.reduce((_children, { MainComponent, usesPkgs, pkgId }) => {
        const deps = Object.entries(usesPkgs).reduce(
          (usePkgHandles, [key, targetPkgId]) => ({
            ...usePkgHandles,
            [key]: getUseUsePkgHandle(targetPkgId, pkgId),
          }),
          {},
        )
        const me = getUseUsePkgHandle(pkgId, pkgId)
        return (
          <PkgContext.Provider value={{ me, use: deps }} key={`${pkgId.name}@${pkgId.version}`}>
            <MainComponent>{_children}</MainComponent>
          </PkgContext.Provider>
        )
      }, <>{children}</>),
    [children],
  )

  return Main
}

function getPlugins() {
  type PluginMainComponentObject = {
    MainComponent: ReactAppMainComponent
    pkgId: PkgIdentifier
    usesPkgs: WebPkgDeps
  }
  type Plugins = {
    pkgs: PluginMainComponentObject[]
  }
  const plugins: Plugins = {
    ..._connect,
    pkgs: _connect.pkgs.slice().reverse(),
  }
  _connect.pkgs.length = 0
  _connect.pkgs = null
  return plugins
}
