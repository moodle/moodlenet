import { baseStyle, BaseStyleType } from '@moodlenet/component-library'
import {
  ComponentType,
  createContext,
  CSSProperties,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AppearanceData } from '../../types/data.mjs'
import { MainContext } from './MainContext.js'
// import lib from '../../../../main-lib'

export type StyleType = BaseStyleType & CSSProperties

export const StyleContextDefault = {
  ...baseStyle(),
}

export type SettingsSectionItem = {
  Menu: ComponentType
  Content: ComponentType
}

export type SetCtxT = {
  style: StyleType
  setStyle: React.Dispatch<React.SetStateAction<StyleType>>
  saveAppearance(data: AppearanceData): unknown
  appearanceData: AppearanceData
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SettingsCtx = createContext<SetCtxT>(null as any)

export const Provider: FC<PropsWithChildren> = ({ children }) => {
  // const nav = useNavigate()
  const {
    pkgs: [reactAppSrv, organizationSrv],
  } = useContext(MainContext)

  // dentro a use effect prendo il valore
  const [style, setStyle] = useState<SetCtxT['style']>(StyleContextDefault)
  const [appearanceData, setAppareanceData] = useState<AppearanceData>({ color: '' })

  const saveAppearance = useCallback(
    (data: AppearanceData) => {
      reactAppSrv.call('setAppearance')({ appearanceData: data })

      setAppareanceData(data)
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

  const ctx = useMemo<SetCtxT>(() => {
    return {
      style,
      setStyle,
      saveAppearance,
      appearanceData,
    }
  }, [style, saveAppearance, appearanceData])

  return <SettingsCtx.Provider value={ctx}>{children}</SettingsCtx.Provider>
}
