import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { useLoginCtrl } from '../ui/components/pages/Access/Login/Ctrl/LoginCtrl'
import { Login } from '../ui/components/pages/Access/Login/Login'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

export const LoginRouteComponent: RouteFC<Routes.Login> = ({
  match: {
    params: { activationEmailToken },
  },
}) => {
  const props = ctrlHook(useLoginCtrl, { activationEmailToken }, 'login-route')
  return <Login {...props} />
}

export const LoginRoute: MNRouteProps<Routes.Login> = {
  component: LoginRouteComponent,
  path: '/login/:activationEmailToken?',
  exact: true,
}
