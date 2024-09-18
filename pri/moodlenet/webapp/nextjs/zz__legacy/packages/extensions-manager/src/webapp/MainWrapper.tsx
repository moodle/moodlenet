import type { MainAppPluginWrapper } from '@moodlenet/react-app/webapp'

import { useState } from 'react'
import type { DeployedPkgInfo, SearchPackagesResObject } from '../common/data.mjs'
import { MainContext } from './MainContext'

const MainWrapper: MainAppPluginWrapper = ({ children }) => {
  const [devMode, setDevMode] = useState(false)
  const [selectedExtConfig, setSelectedExtConfig] = useState<DeployedPkgInfo | null>(null)
  const [selectedExtInfo, setSelectedExtInfo] = useState<SearchPackagesResObject | null>(null)
  // const [searchPkgResp, setSearchPkgResp] = useState<SearchPackagesResponse>({ objects: [] })
  // const [defaultRegistry, setDefaultRegistry] = useState<string>('')

  // useEffect(() => {
  //   shell.rpc.me.searchPackages({ searchText: 'moodlenet' }).then(resp => setSearchPkgResp(resp))

  //   shell.rpc.me.getDefaultRegistry().then(resp => setDefaultRegistry(resp))
  // }, [])

  return (
    <MainContext.Provider
      value={{
        // defaultRegistry,
        devMode,
        setDevMode,
        selectedExtConfig,
        setSelectedExtConfig,
        selectedExtInfo,
        setSelectedExtInfo,
        // searchPkgResp,
      }}
    >
      {children}
    </MainContext.Provider>
  )
}

export default MainWrapper
