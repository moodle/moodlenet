import { PackageInfo } from '@moodlenet/core'
import {
  PluginMainComponent,
  ReactAppPluginMainModule,
  WebappPluginMainModule,
  WebAppShellOf,
} from '@moodlenet/react-app'
import React, { createContext, useEffect, useState } from 'react'
import { ExtensionsManagerExt } from '..'
import { SearchPackagesResObject, SearchPackagesResponse } from '../types/data'
import * as SettingsEnabledExtComponents from './SettingsEnabledExt'
import * as SettingsInstallComponents from './SettingsInstall'

export type ExtensionsManagerExtWebappPlugin = WebappPluginMainModule<
  ExtensionsManagerExt,
  void,
  [never, ReactAppPluginMainModule]
>

export type MainContextType = {
  shell: WebAppShellOf<ExtensionsManagerExtWebappPlugin>
  devMode: boolean
  setDevMode: React.Dispatch<React.SetStateAction<boolean>>
  selectedExtConfig: PackageInfo | null
  setSelectedExtConfig: React.Dispatch<React.SetStateAction<PackageInfo | null>>
  selectedExtInfo: SearchPackagesResObject | null
  setSelectedExtInfo: React.Dispatch<React.SetStateAction<SearchPackagesResObject | null>>
  searchPkgResp: SearchPackagesResponse | undefined
  setSearchPkgResp: React.Dispatch<React.SetStateAction<SearchPackagesResponse | undefined>>
}

export const MainContext = createContext<MainContextType>(null as any)

const mainModule: ExtensionsManagerExtWebappPlugin = {
  connect(shell) {
    const [, reactApp] = shell.deps
    reactApp.settings.section.register(SettingsInstallComponents)
    reactApp.settings.section.register(SettingsEnabledExtComponents)

    const StateProvider: PluginMainComponent = ({ children }) => {
      const [devMode, setDevMode] = useState(false)
      const [selectedExtConfig, setSelectedExtConfig] = useState<PackageInfo | null>(null)
      const [selectedExtInfo, setSelectedExtInfo] = useState<SearchPackagesResObject | null>(null)
      const [searchPkgResp, setSearchPkgResp] = useState<SearchPackagesResponse>()

      useEffect(() => {
        shell.http
          .fetch('searchPackages')({ searchText: 'moodlenet' })
          .then(resp => setSearchPkgResp(resp))
      }, [])

      return (
        <MainContext.Provider
          value={{
            shell,
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

    return {
      MainComponent: StateProvider,
    }
  },
}

export default mainModule
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
