import {
  ReactAppMainComponent,
  registries,
  SettingsSectionItem,
} from '@moodlenet/react-app/web-lib'

import { useEffect, useState } from 'react'
import type {
  DeployedPkgInfo,
  SearchPackagesResObject,
  SearchPackagesResponse,
} from '../types/data.mjs'
import { MainContext } from './MainContext.js'
import type { WebPkgDeps } from './types.mjs'
import { ExtensionsMenu } from './components/pages/Extensions/Extensions.js'
import { ExtensionsContainer } from './components/pages/Extensions/ExtensionsContainer.js'

const extensionSettingsItem: SettingsSectionItem = {
  Menu: ExtensionsMenu,
  Content: ExtensionsContainer,
}
const MainComponent: ReactAppMainComponent<WebPkgDeps> = ({ pkgs, pkgId, children }) => {
  registries.settingsSections.useRegister(pkgId, extensionSettingsItem)

  const [devMode, setDevMode] = useState(false)
  const [selectedExtConfig, setSelectedExtConfig] = useState<DeployedPkgInfo | null>(null)
  const [selectedExtInfo, setSelectedExtInfo] = useState<SearchPackagesResObject | null>(null)
  const [searchPkgResp, setSearchPkgResp] = useState<SearchPackagesResponse>({ objects: [] })
  const [defaultRegistry, setDefaultRegistry] = useState<string>('')
  const [myPkg] = pkgs

  useEffect(() => {
    myPkg
      .call('searchPackages')({ searchText: 'moodlenet' })
      .then(resp => setSearchPkgResp(resp))

    myPkg
      .call('getDefaultRegistry')()
      .then(resp => setDefaultRegistry(resp))
  }, [myPkg])

  return (
    <MainContext.Provider
      value={{
        defaultRegistry,
        pkgs,
        pkgId,
        devMode,
        setDevMode,
        selectedExtConfig,
        setSelectedExtConfig,
        selectedExtInfo,
        setSelectedExtInfo,
        searchPkgResp,
      }}
    >
      {children}
    </MainContext.Provider>
  )
}

export default MainComponent
