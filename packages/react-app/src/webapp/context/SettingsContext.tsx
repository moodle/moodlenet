import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { defaultAppearanceData } from '../../common/appearance/data.mjs'
import type { AppearanceData } from '../../common/types.mjs'
import { shell } from '../shell.mjs'
// import lib from '../../../../main-lib'

export type SettingsCtxT = {
  saveAppearanceData(data: AppearanceData): unknown
  appearanceData: AppearanceData
  devMode: boolean
  toggleDevMode(): void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SettingsCtx = createContext<SettingsCtxT>(null as any)

export const ProvideSettingsContext: FC<PropsWithChildren> = ({ children }) => {
  const [appearanceData, setAppareanceData] = useState<AppearanceData>(defaultAppearanceData)

  const saveAppearanceData = useCallback(async (newAppearanceData: AppearanceData) => {
    await shell.rpc.me.setAppearance({ appearanceData: newAppearanceData })

    setAppareanceData(newAppearanceData)
  }, [])

  const [devMode, toggleDevMode] = useReducer(prev => !prev, false)

  useEffect(() => {
    shell.rpc.me
      .getAppearance()
      .then(({ data: appearanceData }) => setAppareanceData(appearanceData))
  }, [])

  const ctx = useMemo<SettingsCtxT>(() => {
    return {
      saveAppearanceData,
      appearanceData,
      devMode,
      toggleDevMode,
    }
  }, [saveAppearanceData, appearanceData, devMode])

  return <SettingsCtx.Provider value={ctx}>{children}</SettingsCtx.Provider>
}
