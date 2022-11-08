import { HeaderProps, HeaderTitleProps } from '@moodlenet/component-library'
import { useHeaderProps } from '../../layout/Headers/HeaderHooks.mjs'
import { LandingProps } from './Landing.js'

export const HeaderTitleOrganizationStoryProps: HeaderTitleProps = {
  //   homeHref: href('Landing/Logged In'),
  url: 'https://www.bfh.ch/',
  logo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
  smallLogo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
}

export const HeaderLoggedOutStoryProps: HeaderProps = {
  leftItems: [],
  centerItems: [],
  rightItems: [],
  headerTitleProps: HeaderTitleOrganizationStoryProps,
}

export const useLandingPageProps = (): LandingProps => {
  const headerProps = useHeaderProps()

  return {
    mainLayoutProps: { headerProps },
    title: 'Find, share and curate open educational resources',
    subtitle: 'Search for resources, subjects, collections or people',
  }
}
