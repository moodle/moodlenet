import { HeaderTitleProps } from '@moodlenet/component-library'
import { useContext } from 'react'
import { SettingsCtx } from '../../pages/Settings/SettingsContext.js'

export const useHeaderTitleProps = (): HeaderTitleProps => {
  const { organizationData } = useContext(SettingsCtx)

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
