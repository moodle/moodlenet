import { PackageInfo } from '@moodlenet/core'
import lib from 'moodlenet-react-app-lib'
import React, { createContext, FC, PropsWithChildren, useState } from 'react'
import { ExtensionsManagerExt } from '..'
import { SearchPackagesResObject, SearchPackagesResponse } from '../types/data'
import * as SettingsEnabledExtComponents from './SettingsEnabledExt'
import * as SettingsInstallComponents from './SettingsInstall'

export type StateContextType = {
  devMode: boolean
  setDevMode: React.Dispatch<React.SetStateAction<boolean>>
  selectedExtConfig: PackageInfo | null
  setSelectedExtConfig: React.Dispatch<React.SetStateAction<PackageInfo | null>>
  selectedExtInfo: SearchPackagesResObject | null
  setSelectedExtInfo: React.Dispatch<React.SetStateAction<SearchPackagesResObject | null>>
  searchPkgResp: SearchPackagesResponse | undefined
  // setSearchPkgResp: React.Dispatch<React.SetStateAction<SearchPackagesResponse | undefined>>
}

export const StateContext = createContext<StateContextType>(null as any)
const useExtMngFetch = lib.priHttp.fetchHook<ExtensionsManagerExt>('@moodlenet/extensions-manager@0.1.0')
const StateProvider: FC<PropsWithChildren> = ({ children }) => {
  const [devMode, setDevMode] = useState(false)
  const [selectedExtConfig, setSelectedExtConfig] = useState<PackageInfo | null>(null)
  const [selectedExtInfo, setSelectedExtInfo] = useState<SearchPackagesResObject | null>(null)
  // const [searchPkgResp, setSearchPkgResp] = useState<SearchPackagesResponse>()
  lib.settings.useRegisterSettingsItem(SettingsInstallComponents)
  lib.settings.useRegisterSettingsItem(SettingsEnabledExtComponents)

  const { value: searchPkgResp } = useExtMngFetch('searchPackages', { searchText: 'moodlenet' })

  return (
    <StateContext.Provider
      value={{
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
    </StateContext.Provider>
  )
}

export default StateProvider
// export const useContextState = () => {
//   const state = useContext(StateContext)
//   const setState = useContext(SetStateContext)
//   if (setState === null) throw new Error()
//   return { state, setState } // setBookedBatch: React.Dispatch<React.SetStateAction<State>>
// }

// const App = () => {
//   const { setBookedBatch } = useContextState()
//   useEffect(() => { setBookedBatch({ id: "foo" }) }, [])
// }

// const { setBookedBatch } = useContextState()
