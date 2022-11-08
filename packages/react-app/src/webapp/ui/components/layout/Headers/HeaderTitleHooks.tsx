import { HeaderTitleProps } from '@moodlenet/component-library'
import { useContext } from 'react'
import { OrganizationCtx } from '../../../../context/OrganizationCtx.js'

export const useHeaderTitleProps = (): HeaderTitleProps => {
  const { organizationData } = useContext(OrganizationCtx)
  const { logo, smallLogo } = organizationData
  return {
    logo,
    smallLogo,
    url: '/',
  }
}
