import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { useFollowingCtrl } from '../ui/pages/Following/Ctrl/FollowingCtrl'
import { Following } from '../ui/pages/Following/Following'
import { MNRouteProps, RouteFC } from './lib'

export const FollowingRouteComponent: RouteFC<Routes.FollowingPage> = (/* { match } */) => {
  const props = ctrlHook(useFollowingCtrl, {}, 'Following-route')
  return <Following {...props} />
}

export const FollowingRoute: MNRouteProps<Routes.FollowingPage> = {
  component: FollowingRouteComponent,
  path: '/following',
  exact: true,
}
