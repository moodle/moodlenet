import { useContext } from 'react'
import { OrganizationCtx } from '../../../../context/OrganizationCtx.js'
import { href } from '../../elements/link.js'
import { useMainLayoutProps } from '../../layout/MainLayout/MainLayoutHooks.mjs'
import { LandingProps } from './Landing.js'

export const useLandingPageProps = (): LandingProps => {
  const { organizationData } = useContext(OrganizationCtx)
  return {
    mainLayoutProps: useMainLayoutProps(),
    title: organizationData.landingTitle,
    subtitle: organizationData.landingSubtitle,
    //TODO //@ETTO next props temporary faked to avoid compliation errors
    mainColumnItems: [],
    shareContentModalItems: [],
    loginHref: href('/login'),
    signUpHref: href('/signup'),
    newResourceHref: href('/new-resource'),
    newCollectionHref: href('/new-collection'),
  }
}
