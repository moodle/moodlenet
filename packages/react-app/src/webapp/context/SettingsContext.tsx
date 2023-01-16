import {
  ComponentType,
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import { defaultAppearanceData } from '../../common/appearance/data.mjs'
import { AppearanceData } from '../../common/types.mjs'
import { MainContext } from './MainContext.mjs'
// import lib from '../../../../main-lib'

export type SettingsSectionItem = {
  Menu: ComponentType
  Content: ComponentType
}

export type SettingsCtxT = {
  saveAppearanceData(data: AppearanceData): unknown
  appearanceData: AppearanceData
  devMode: boolean
  toggleDevMode(): void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SettingsCtx = createContext<SettingsCtxT>(null as any)

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    use: { me },
  } = useContext(MainContext)

  const [appearanceData, setAppareanceData] = useState<AppearanceData>(defaultAppearanceData)

  const saveAppearanceData = useCallback(
    async (newAppearanceData: AppearanceData) => {
      await me.rpc('setAppearance')({ appearanceData: newAppearanceData })

      setAppareanceData(newAppearanceData)
    },
    [me],
  )

  const [devMode, toggleDevMode] = useReducer(prev => !prev, false)

  useEffect(() => {
    me.rpc('getAppearance')().then(({ data: appearanceData }) => setAppareanceData(appearanceData))
  }, [me])

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
