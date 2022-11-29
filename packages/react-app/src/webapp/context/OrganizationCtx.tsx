import { OrganizationData } from '@moodlenet/organization'
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { MainContext } from './MainContext.js'

const EmptyOrganizationData = {
  instanceName: '',
  landingTitle: '',
  landingSubtitle: '',
  smallLogo: '',
  logo: '',
}

export type TOrganizationCtx = {
  organizationData: OrganizationData
  saveOrganization: (data: OrganizationData) => void
}

export const OrganizationCtx = createContext<TOrganizationCtx>(null as any)

export const Provider: FC<PropsWithChildren> = ({ children }) => {
  const [organizationData, setDataOrg] = useState<OrganizationData>(EmptyOrganizationData)
  const {
    pkgs: [, organizationSrv],
  } = useContext(MainContext)

  const saveOrganization = useCallback(
    // WE CAN NOT USE IT IS CALLED 1 TIME ONLY
    (data: OrganizationData) => {
      organizationSrv.call('setOrgData')({ orgData: data })
      setDataOrg(data)
    },
    [organizationSrv],
  )

  useEffect(() => {
    organizationSrv
      .call('getOrgData')()
      .then(({ data: orgData }: { data: OrganizationData }) => setDataOrg(orgData))
  }, [organizationSrv])

  const ctx: TOrganizationCtx = {
    saveOrganization,
    organizationData,
  }

  return <OrganizationCtx.Provider value={ctx}>{children}</OrganizationCtx.Provider>

  /*{
    logo: organizationData.logo,
    smallLogo : organizationData.smallLogo,
    url: '/',
  } */
}
