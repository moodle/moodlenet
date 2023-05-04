import type { OrganizationData } from '@moodlenet/organization/common'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { MainContext } from './MainContext.mjs'

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
  const { use } = useContext(MainContext)

  const saveOrganization = useCallback(
    // WE CAN NOT USE IT IS CALLED 1 TIME ONLY
    (data: OrganizationData) => {
      use.me.rpc.setOrgData({ orgData: data })
      setDataOrg(data)
    },
    [use.me],
  )

  useEffect(() => {
    use.me.rpc
      .getOrgData()
      .then(({ data: orgData }: { data: OrganizationData }) => setDataOrg(orgData))
  }, [use.me])

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
