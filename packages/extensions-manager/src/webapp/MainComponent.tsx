import {
  ReactAppContext,
  ReactAppMainComponent,
  SettingsSectionItem,
  usePkgContext,
} from '@moodlenet/react-app/webapp'

import { useContext, useEffect, useState } from 'react'
import type {
  DeployedPkgInfo,
  SearchPackagesResObject,
  SearchPackagesResponse,
} from '../common/data.mjs'
import { MyPkgContext } from '../common/types.mjs'
import { ExtensionsMenu } from './components/pages/Extensions/Extensions.js'
import { ExtensionsContainer } from './components/pages/Extensions/ExtensionsContainer.js'
import { MainContext } from './MainContext.js'

const extensionSettingsItem: SettingsSectionItem = {
  Menu: ExtensionsMenu,
  Content: ExtensionsContainer,
}
const MainComponent: ReactAppMainComponent = ({ children }) => {
  const myPkgCtx = usePkgContext<MyPkgContext>()
  const {
    use: { me },
  } = myPkgCtx
  const { registries } = useContext(ReactAppContext)
  registries.settingsSections.useRegister(extensionSettingsItem)

  const [devMode, setDevMode] = useState(false)
  const [selectedExtConfig, setSelectedExtConfig] = useState<DeployedPkgInfo | null>(null)
  const [selectedExtInfo, setSelectedExtInfo] = useState<SearchPackagesResObject | null>(null)
  const [searchPkgResp, setSearchPkgResp] = useState<SearchPackagesResponse>({ objects: [] })
  const [defaultRegistry, setDefaultRegistry] = useState<string>('')

  useEffect(() => {
    me.rpc.searchPackages({ searchText: 'moodlenet' }).then(resp => setSearchPkgResp(resp))

    me.rpc.getDefaultRegistry().then(resp => setDefaultRegistry(resp))
  }, [me])

  return (
    <MainContext.Provider
      value={{
        ...myPkgCtx,
        defaultRegistry,
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
