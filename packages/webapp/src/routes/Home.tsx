import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { HomePageCtrl } from '../ctrl/pages/HomePageCtrl'
import { MNRouteProps, RouteFC } from './lib'

export const HomeRouteComponent: RouteFC<Routes.Home> = (/* { match } */) => {
  return <HomePageCtrl />
}

export const HomeRoute: MNRouteProps<Routes.Home> = {
  component: HomeRouteComponent,
  path: '/',
  exact: true,
}
