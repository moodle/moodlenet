import { HeaderTitleProps } from '@moodlenet/component-library'
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

export const OrganizationCtx = (): OrganizationData => {
  const [organizationData, setDataOrg] = useState<OrganizationData>(OrganizationDataEmpity)
  const {
    pkgs: [reactAppSrv, organizationSrv],
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
      .then(({ data: orgData }) => setDataOrg(orgData))
  }, [organizationSrv])

  return organizationData

  /*{
    logo: organizationData.logo,
    smallLogo : organizationData.smallLogo,
    url: '/',
  } */
}
