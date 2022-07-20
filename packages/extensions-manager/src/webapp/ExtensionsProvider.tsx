import { ExtInfo } from '@moodlenet/core'
import lib from 'moodlenet-react-app-lib'
import React, { createContext, FC, PropsWithChildren, useState } from 'react'
import { SearchPackagesResObject } from '../types/data'
import * as SettingsEnabledExtComponents from './SettingsEnabledExt'
import * as SettingsInstallComponents from './SettingsInstall'

export type StateContextType = {
  devMode: boolean
  setDevMode: React.Dispatch<React.SetStateAction<boolean>>
  selectedExtConfig: ExtInfo | null
  setSelectedExtConfig: React.Dispatch<React.SetStateAction<ExtInfo | null>>
  selectedExtInfo: SearchPackagesResObject | null
  setSelectedExtInfo: React.Dispatch<React.SetStateAction<SearchPackagesResObject | null>>
}

export const StateContext = createContext<StateContextType>(null as any)

const StateProvider: FC<PropsWithChildren> = ({ children }) => {
  const [devMode, setDevMode] = useState(false)
  const [selectedExtConfig, setSelectedExtConfig] = useState<ExtInfo | null>(null)
  const [selectedExtInfo, setSelectedExtInfo] = useState<SearchPackagesResObject | null>(null)
  lib.settings.useRegisterSettingsItem(SettingsInstallComponents)
  lib.settings.useRegisterSettingsItem(SettingsEnabledExtComponents)

  return (
    <StateContext.Provider
      value={{ devMode, setDevMode, selectedExtConfig, setSelectedExtConfig, selectedExtInfo, setSelectedExtInfo }}
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
