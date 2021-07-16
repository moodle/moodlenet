import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { loginWithProps } from '../ui/pages/Access/Login/Ctrl/LoginCtrl'
import { Login } from '../ui/pages/Access/Login/Login'
import { MNRouteProps, RouteFC } from './lib'

export const LoginRouteComponent: RouteFC<Routes.Login> = (/* { match } */) => {
  const [LoginCtrl, loginProps] = loginWithProps({ key: `Login Page` })(Login)

  return <LoginCtrl {...loginProps} />
}

export const LoginRoute: MNRouteProps<Routes.Login> = {
  component: LoginRouteComponent,
  path: '/login',
  exact: true,
}
