import { HeaderTitleProps } from '@moodlenet/component-library'
import { useContext } from 'react'
import { SettingsCtx } from './SettingsContext.js'
import { OrganizationData } from '@moodlenet/organization'

import { MainContext } from '../../../../MainContext.js'

export const useHeaderTitleProps = (): HeaderTitleProps => {
  const {
    pkgs: [reactAppSrv, organizationSrv],
  } = useContext(MainContext)

  const [organizationData, setDataOrg] = useState<OrganizationData>({
    instanceName: '',
    landingTitle: '',
    landingSubtitle: '',
    smallLogo: '',
    logo: '',
  })

  const { organizationData, appearanceData, saveAppearance } = useContext(SettingsCtx)

  const saveOrganization = useCallback(
    (data: OrganizationData) => {
      organizationSrv.call('setOrgData')({ orgData: data })
      setDataOrg(data)
    },
    [organizationSrv],
  )

  const { logo, smallLogo } = organizationData
  // usa i server
  // usa i context
  // ritorna HeaderTitleProps
  return {
    logo,
    smallLogo,
    url: '/',
  }
}
