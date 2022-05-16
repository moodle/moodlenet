import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { useFollowersCtrl } from '../ui/components/pages/Followers/Ctrl/FollowersCtrl'
import { Followers } from '../ui/components/pages/Followers/Followers'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

export const FollowersRouteComponent: RouteFC<
  Routes.FollowersPage
> = (/* { match } */) => {
  const props = ctrlHook(useFollowersCtrl, {}, 'followers-route')
  return <Followers {...props} />
}

export const FollowersRoute: MNRouteProps<Routes.FollowersPage> = {
  component: FollowersRouteComponent,
  path: '/followers',
  exact: true,
}
