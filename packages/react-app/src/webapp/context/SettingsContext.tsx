import {
  createContext,
  FC,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AppearanceData, CustomStyleType } from '../../types/data.mjs'
import { baseMoodleColor, baseStyle } from '../ui/styles/config.js'
import { MainContext } from './MainContext.js'
// import lib from '../../../../main-lib'

export const defaultCustomStyle: CustomStyleType = {
  ...baseStyle(),
}

export type SettingsSectionItem = {
  Menu: ReactElement
  Content: ReactElement
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

  const [appearanceData, setAppareanceData] = useState<AppearanceData>({
    color: baseMoodleColor,
    customStyle: defaultCustomStyle,
  })

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
      .then(({ data: appearanceData }: { data: AppearanceData }) =>
        setAppareanceData(appearanceData),
      )
  }, [organizationSrv, reactAppSrv])

  const ctx = useMemo<SettingsCtxT>(() => {
    return {
      saveAppearanceData,
      appearanceData,
    }
  }, [saveAppearanceData, appearanceData])

  return <SettingsCtx.Provider value={ctx}>{children}</SettingsCtx.Provider>
}
