import { LoginPageCtrl } from '../ctrl/pages/LoginPageCtrl'
import { LoginRouteDef } from '../sitemap'
import { MNRouteProps, RouteFC } from '../sitemap/lib'

export const LoginRouteComponent: RouteFC<LoginRouteDef> = (/* { match } */) => {
  return <LoginPageCtrl />
}

export const LoginRoute: MNRouteProps<LoginRouteDef> = {
  component: LoginRouteComponent,
  path: '/login',
  exact: true,
}
