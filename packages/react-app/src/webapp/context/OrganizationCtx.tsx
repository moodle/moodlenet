import type { OrganizationData } from '@moodlenet/organization/common'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useEffect, useState } from 'react'
import { shell } from '../init.mjs'

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

export const OrganizationCtx = createContext<TOrganizationCtx>(null as never)

export const Provider: FC<PropsWithChildren> = ({ children }) => {
  const [organizationData, setDataOrg] = useState<OrganizationData>(EmptyOrganizationData)

  const saveOrganization = useCallback(
    // WE CAN NOT USE IT IS CALLED 1 TIME ONLY
    (data: OrganizationData) => {
      shell.rpc.me.setOrgData({ orgData: data })
      setDataOrg(data)
    },
    [],
  )

  useEffect(() => {
    shell.rpc.me
      .getOrgData()
      .then(({ data: orgData }: { data: OrganizationData }) => setDataOrg(orgData))
  }, [])

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
