import { PkgIdentifier } from '@moodlenet/core'
import { FC, PropsWithChildren, useMemo } from 'react'
import _connect from '_connect-moodlenet-pkg-modules_'
import { PkgContext } from './context/PkgContext.mjs'
import { ReactAppMainComponent } from './web-lib.mjs'
import { getUseUsePkgHandle } from './web-lib/pri-http/xhr-adapter/callPkgApis.mjs'

const plugins = getPlugins()

export const PkgMainComponentsWrap: FC<PropsWithChildren> = ({ children }) => {
  const Main = useMemo(
    () =>
      plugins.pkgs.reduce((_children, { MainComponent, deps, pkgId }) => {
        const use = Object.entries(deps).reduce(
          (usePkgHandles, [key, targetPkgId]) => ({
            ...usePkgHandles,
            [key]: getUseUsePkgHandle({ targetPkgId, userPkgId: pkgId }),
          }),
          {},
        )
        return (
          <PkgContext.Provider value={{ use, myId: pkgId }} key={`${pkgId.name}@${pkgId.version}`}>
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
    deps: { [depName: string]: PkgIdentifier }
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
