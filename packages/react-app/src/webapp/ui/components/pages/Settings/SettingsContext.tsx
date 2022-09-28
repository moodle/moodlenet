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
import { AppearanceData } from '../../../../../types.mjs'
import { MainContext } from '../../../../MainContext.js'
// import lib from '../../../../main-lib'
import { baseStyle, BaseStyleType } from '../../../styles/config.js'

export type OrganizationData = {
  instanceName: string
  landingTitle: string
  landingSubtitle: string
}

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

export const SettingsCtx = createContext<SetCtxT>(null as any)

export const Provider: FC<PropsWithChildren<{}>> = ({ children }) => {
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
  })

  const saveOrganization = useCallback(
    (data: OrganizationData) => {
      organizationSrv.call('setOrgData')({ orgData: data })
      setDataOrg(data)
    },
    [setDataOrg],
  )

  const saveAppearance = useCallback(
    (data: AppearanceData) => {
      reactAppSrv.call('setAppearance')({ appearanceData: data })

      setAppareanceData(data)
    },
    [setDataOrg],
  )

  useEffect(() => {
    organizationSrv
      .call('getOrgData')()
      .then(({ data: orgData }) => setDataOrg(orgData))
    reactAppSrv
      .call('getAppearance')()
      .then(({ data: appearanceData }) => setAppareanceData(appearanceData))
  }, [])

  const ctx = useMemo<SetCtxT>(() => {
    return {
      style,
      setStyle,
      saveOrganization,
      organizationData,
      saveAppearance,
      appearanceData,
    }
  }, [style, setStyle, organizationData, appearanceData])

  return <SettingsCtx.Provider value={ctx}>{children}</SettingsCtx.Provider>
}
