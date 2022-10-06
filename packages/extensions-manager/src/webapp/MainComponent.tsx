import { ReactAppMainComponent, registries } from '@moodlenet/react-app/web-lib.mjs'
import * as SettingsEnabledExtComponents from './SettingsEnabledExt.js'
import * as SettingsInstallComponents from './SettingsInstall.js'

import { createContext, useEffect, useState } from 'react'
import type { DeployedPkgInfo, SearchPackagesResObject, SearchPackagesResponse } from '../types/data.mjs'
import ExtensionsRoutes from './ExtensionsRoutes.js'
import type { MainContextType, WebPkgDeps } from './types.mjs'

export const MainContext = createContext<MainContextType>(null as any)

const MainComponent: ReactAppMainComponent<WebPkgDeps> = ({ pkgs, pkgId, children }) => {
  registries.settingsSections.useRegister(pkgId, SettingsInstallComponents)
  registries.settingsSections.useRegister(pkgId, SettingsEnabledExtComponents)
  registries.routes.useRegister(pkgId, ExtensionsRoutes)

  const [devMode, setDevMode] = useState(false)
  const [selectedExtConfig, setSelectedExtConfig] = useState<DeployedPkgInfo | null>(null)
  const [selectedExtInfo, setSelectedExtInfo] = useState<SearchPackagesResObject | null>(null)
  const [searchPkgResp, setSearchPkgResp] = useState<SearchPackagesResponse>()
  const [myPkg] = pkgs

  useEffect(() => {
    myPkg
      .call('searchPackages')({ searchText: 'moodlenet' })
      .then(resp => setSearchPkgResp(resp))
  }, [])

  return (
    <MainContext.Provider
      value={{
        pkgs,
        pkgId,
        devMode,
        setDevMode,
        selectedExtConfig,
        setSelectedExtConfig,
        selectedExtInfo,
        setSelectedExtInfo,
        searchPkgResp,
        setSearchPkgResp,
      }}
    >
      {children}
    </MainContext.Provider>
  )
}

export default MainComponent