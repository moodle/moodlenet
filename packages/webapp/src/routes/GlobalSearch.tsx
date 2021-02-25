import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { GlobalSearchPageCtrl } from '../ctrl/pages/GlobalSearchPageCtrl'
import { MNRouteProps, RouteFC } from './lib'

export const GlobalSearchRouteComponent: RouteFC<Routes.GlobalSearch> = (/* { match, history } */) => {
  return <GlobalSearchPageCtrl />
}

export const GlobalSearchRoute: MNRouteProps<Routes.GlobalSearch> = {
  component: GlobalSearchRouteComponent,
  path: '/search',
  exact: true,
}
