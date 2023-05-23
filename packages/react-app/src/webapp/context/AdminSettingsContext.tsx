import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { defaultAppearanceData } from '../../common/appearance/data.mjs'
import type { AppearanceData } from '../../common/types.mjs'
import { shell } from '../shell.mjs'
// import lib from '../../../../main-lib'

export type AdminSettingsCtxT = {
  saveAppearanceData(data: AppearanceData): unknown
  appearanceData: AppearanceData
  devMode: boolean
  toggleDevMode(): void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AdminSettingsCtx = createContext<AdminSettingsCtxT>(null as any)

export const ProvideAdminSettingsContext: FC<PropsWithChildren> = ({ children }) => {
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

  const ctx = useMemo<AdminSettingsCtxT>(() => {
    return {
      saveAppearanceData,
      appearanceData,
      devMode,
      toggleDevMode,
    }
  }, [saveAppearanceData, appearanceData, devMode])

  return <AdminSettingsCtx.Provider value={ctx}>{children}</AdminSettingsCtx.Provider>
}
