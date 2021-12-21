import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { useLandingCtrl } from '../ui/components/pages/Landing/Ctrl/LandingCtrl'
import { Landing } from '../ui/components/pages/Landing/Landing'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

export const LandingRouteComponent: RouteFC<
  Routes.Landing
> = (/* { match } */) => {
  const props = ctrlHook(useLandingCtrl, {}, 'landing-route')
  return <Landing {...props} />
}

export const LandingRoute: MNRouteProps<Routes.Landing> = {
  component: LandingRouteComponent,
  path: '/',
  exact: true,
}
