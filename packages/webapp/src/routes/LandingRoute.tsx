import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { landingWithProps } from '../ui/pages/Landing/Ctrl/LandingCtrl'
import { Landing } from '../ui/pages/Landing/Landing'
import { MNRouteProps, RouteFC } from './lib'

export const LandingRouteComponent: RouteFC<Routes.Landing> = (/* { match } */) => {
  const [LandingCtrl, landingProps] = landingWithProps({ key: `Landing Page` })(Landing)

  return <LandingCtrl {...landingProps} />
}

export const LandingRoute: MNRouteProps<Routes.Landing> = {
  component: LandingRouteComponent,
  path: '/',
  exact: true,
}
