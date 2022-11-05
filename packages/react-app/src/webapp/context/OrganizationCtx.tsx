import { HeaderTitleProps } from '@moodlenet/component-library'
import { OrganizationData } from '@moodlenet/organization'
import { useContext } from 'react'
import { SettingsCtx } from './SettingsContext.js'

export const OrganitionCtx = (): HeaderTitleProps => {
  const { organizationData,  appearanceData, saveAppearance  } = useContext(SettingsCtx)

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
