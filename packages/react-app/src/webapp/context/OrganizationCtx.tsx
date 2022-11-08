import { OrganizationData } from '@moodlenet/organization'
import { useCallback, useContext, useEffect, useState } from 'react'

import { MainContext } from './MainContext.js'

const OrganizationDataEmpity = {
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

export const OrganizationCtx = (): TOrganizationCtx => {
  const [organizationData, setDataOrg] = useState<OrganizationData>(OrganizationDataEmpity)
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

  return {
    saveOrganization,
    organizationData,
  }

  /*{
    logo: organizationData.logo,
    smallLogo : organizationData.smallLogo,
    url: '/',
  } */
}
