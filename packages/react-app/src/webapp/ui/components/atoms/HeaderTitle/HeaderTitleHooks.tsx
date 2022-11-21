import { useMemo } from 'react'
import { href } from '../../elements/link.js'
import { HeaderTitleProps } from './HeaderTitle.js'

export const useHeaderTitleProps = (): HeaderTitleProps => {
  // const { organizationData } = useContext(OrganizationCtx)
  // const { logo, smallLogo } = organizationData

  const headerTitleProps = useMemo<HeaderTitleProps>(() => {
    return {
      logo: '',
      smallLogo: '',
      url: href('/'),
    }
  }, [])

  return headerTitleProps
}
