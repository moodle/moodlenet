import { useMainLayoutProps } from '../../layout/MainLayout/MainLayoutHooks.mjs'
import { LandingProps } from './Landing.js'

export const useLandingPageProps = (): LandingProps => {
  return {
    mainLayoutProps: useMainLayoutProps(),
    title: 'Find, share and curate open educational resources',
    subtitle: 'Search for resources, subjects, collections or people',
  }
}
