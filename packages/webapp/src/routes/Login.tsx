import { Routes } from '../../../common/lib/webapp/sitemap'
import { LoginPageCtrl } from '../ctrl/pages/LoginPageCtrl'
import { MNRouteProps, RouteFC } from './lib'

export const LoginRouteComponent: RouteFC<Routes.Login> = (/* { match } */) => {
  return <LoginPageCtrl />
}

export const LoginRoute: MNRouteProps<Routes.Login> = {
  component: LoginRouteComponent,
  path: '/login',
  exact: true,
}
