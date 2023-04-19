import { useContext } from 'react'
import { OrganizationCtx } from '../../../../context/OrganizationCtx.js'
import { useMainLayoutProps } from '../../layout/MainLayout/MainLayoutHooks.mjs'
import { LandingProps } from './Landing.js'

export const useLandingPageProps = (): LandingProps => {
  const { organizationData } = useContext(OrganizationCtx)
  return {
    mainLayoutProps: useMainLayoutProps(),
    title: organizationData.landingTitle,
    subtitle: organizationData.landingSubtitle,
    mainColumnItems: [],
    search: () => undefined,
  }
}
