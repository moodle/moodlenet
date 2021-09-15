import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { useLoginCtrl } from '../ui/pages/Access/Login/Ctrl/LoginCtrl'
import { Login } from '../ui/pages/Access/Login/Login'
import { MNRouteProps, RouteFC } from './lib'

export const LoginRouteComponent: RouteFC<Routes.Login> = (/* {
  match: {
    params: { activationToken },
  },
} */) => {
  const props = ctrlHook(useLoginCtrl, {}, 'login-route')
  return <Login {...props} />
}

export const LoginRoute: MNRouteProps<Routes.Login> = {
  component: LoginRouteComponent,
  path: '/login/:activationToken?',
  exact: true,
}
