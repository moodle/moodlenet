import { baseStyle, BaseStyleType } from '@moodlenet/component-library'
import { OrganizationData } from '@moodlenet/organization'
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
import { AppearanceData } from '../types.mjs'
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
  saveOrganization(data: OrganizationData): unknown
  organizationData: OrganizationData
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
  const [organizationData, setDataOrg] = useState<OrganizationData>({
    instanceName: '',
    landingTitle: '',
    landingSubtitle: '',
    smallLogo: '',
    logo: '',
  })

  const saveOrganization = useCallback(
    (data: OrganizationData) => {
      organizationSrv.call('setOrgData')({ orgData: data })
      setDataOrg(data)
    },
    [organizationSrv],
  )

  const saveAppearance = useCallback(
    (data: AppearanceData) => {
      reactAppSrv.call('setAppearance')({ appearanceData: data })

      setAppareanceData(data)
    },
    [reactAppSrv],
  )

  useEffect(() => {
    organizationSrv
      .call('getOrgData')()
      .then(({ data: orgData }) => setDataOrg(orgData))
    reactAppSrv
      .call('getAppearance')()
      .then(({ data: appearanceData }) => setAppareanceData(appearanceData))
  }, [organizationSrv, reactAppSrv])

  const ctx = useMemo<SetCtxT>(() => {
    return {
      style,
      setStyle,
      saveOrganization,
      organizationData,
      saveAppearance,
      appearanceData,
    }
  }, [style, saveOrganization, organizationData, saveAppearance, appearanceData])

  return <SettingsCtx.Provider value={ctx}>{children}</SettingsCtx.Provider>
}
