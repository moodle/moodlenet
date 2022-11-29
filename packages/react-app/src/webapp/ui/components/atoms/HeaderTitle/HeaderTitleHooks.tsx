import { useMemo } from 'react'
import { href } from '../../elements/link.js'
import { HeaderTitleProps } from './HeaderTitle.js'
import smallLogo from '../../../assets/logos/moodlenet-logo-small.png'
import logo from '../../../assets/logos/moodlenet-logo.png'

export const useHeaderTitleProps = (): HeaderTitleProps => {
  // const { organizationData } = useContext(OrganizationCtx)
  // const { logo, smallLogo } = organizationData

  const headerTitleProps = useMemo<HeaderTitleProps>(() => {
    return {
      logo,
      smallLogo,
      url: href('/'),
    }
  }, [])

  return headerTitleProps
}
