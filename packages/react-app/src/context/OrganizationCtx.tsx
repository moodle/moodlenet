import { HeaderTitleProps } from '@moodlenet/component-library'
import { OrganizationData } from '@moodlenet/organization'
import { useContext, useState } from 'react'
import { SettingsCtx } from './SettingsContext.js'

export const OrganizationCtx = (): HeaderTitleProps => {
  ;[organizationData, setDataOrg] = useState<OrganizationData>({
    instanceName: '',
    landingTitle: '',
    landingSubtitle: '',
    smallLogo: '',
    logo: '',
  })
  const { logo, smallLogo } = organizationData
  useEffect(() => {
    organizationSrv
      .call('getOrgData')()
      .then(({ data: orgData }) => setDataOrg(orgData))
    reactAppSrv
      .call('getAppearance')()
      .then(({ data: appearanceData }) => setAppareanceData(appearanceData))
  }, [])

  return {
    logo,
    smallLogo,
    url: '/',
  }
}
