import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { useLandingCtrl } from '../ui/pages/Landing/Ctrl/LandingCtrl'
import { Landing } from '../ui/pages/Landing/Landing'
import { MNRouteProps, RouteFC } from './lib'

export const LandingRouteComponent: RouteFC<Routes.Landing> = (/* { match } */) => {
  const props = ctrlHook(useLandingCtrl, {}, 'Landing Route')
  return <Landing {...props} />
}

export const LandingRoute: MNRouteProps<Routes.Landing> = {
  component: LandingRouteComponent,
  path: '/',
  exact: true,
}
