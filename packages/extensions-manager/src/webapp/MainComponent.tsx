import type { ReactAppMainComponent } from '@moodlenet/react-app/web-lib.mjs'
import { createContext, useEffect, useState } from 'react'
import type { DeployedPkgInfo, SearchPackagesResObject, SearchPackagesResponse } from '../types/data.mjs'
import type { MainContextType, MyUsesPkgs } from './types.mjs'

// reactApp.settings.section.register(SettingsInstallComponents)
// reactApp.settings.section.register(SettingsEnabledExtComponents)

export const MainContext = createContext<MainContextType>(null as any)

const MainComponent: ReactAppMainComponent<MyUsesPkgs> = ({ pkgs, children }) => {
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
