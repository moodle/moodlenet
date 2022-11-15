import {
  ComponentType,
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AppearanceData } from '../../common/types.mjs'
import { defaultAppearanceData } from '../../common/appearance/data.mjs'
import { MainContext } from './MainContext.js'
// import lib from '../../../../main-lib'

export type SettingsSectionItem = {
  Menu: ComponentType
  Content: ComponentType
}

export type AppearanceDataType = AppearanceData
export type SettingsCtxT = {
  saveAppearanceData(data: AppearanceData): unknown
  appearanceData: AppearanceData
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SettingsCtx = createContext<SettingsCtxT>(null as any)

export const Provider: FC<PropsWithChildren> = ({ children }) => {
  const {
    pkgs: [reactAppSrv, organizationSrv],
  } = useContext(MainContext)

  const [appearanceData, setAppareanceData] = useState<AppearanceData>(defaultAppearanceData)

  const saveAppearanceData = useCallback(
    async (newAppearanceData: AppearanceData) => {
      await reactAppSrv.call('setAppearance')({ appearanceData: newAppearanceData })

      setAppareanceData(newAppearanceData)
    },
    [reactAppSrv],
  )

  useEffect(() => {
    reactAppSrv
      .call('getAppearance')()
      .then(({ data: appearanceData }) => setAppareanceData(appearanceData))
  }, [organizationSrv, reactAppSrv])

  const ctx = useMemo<SettingsCtxT>(() => {
    return {
      saveAppearanceData,
      appearanceData,
    }
  }, [saveAppearanceData, appearanceData])

  return <SettingsCtx.Provider value={ctx}>{children}</SettingsCtx.Provider>
}
