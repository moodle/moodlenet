import { Routes } from '../../../common/lib/webapp/sitemap'
import { SignupPageCtrl } from '../ctrl/pages/SignupPageCtrl'
import { MNRouteProps, RouteFC } from './lib'

export const SignupRouteComponent: RouteFC<Routes.Signup> = (/* { match } */) => {
  return <SignupPageCtrl />
}

export const SignupRoute: MNRouteProps<Routes.Signup> = {
  component: SignupRouteComponent,
  path: '/signup',
  exact: true,
}
