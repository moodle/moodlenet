import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { useFollowingCtrl } from '../ui/components/pages/Following/Ctrl/FollowingCtrl'
import { Following } from '../ui/components/pages/Following/Following'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

export const FollowingRouteComponent: RouteFC<
  Routes.FollowingPage
> = (/* { match } */) => {
  const props = ctrlHook(useFollowingCtrl, {}, 'Following-route')
  return <Following {...props} />
}

export const FollowingRoute: MNRouteProps<Routes.FollowingPage> = {
  component: FollowingRouteComponent,
  path: '/following',
  exact: true,
}
