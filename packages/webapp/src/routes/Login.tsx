import { Routes } from '../../../common/lib/webapp/sitemap'
import { useRedirectHomeIfLoggedIn } from '../hooks/glob/nav'
import { useLoginPanelProps } from '../hooks/props/LoginPanelBig'
import { LoginPage } from '../ui/pages/Login'
import { MNRouteProps, RouteFC } from './lib'

export const LoginRouteComponent: RouteFC<Routes.Login> = (/* { match } */) => {
  useRedirectHomeIfLoggedIn()
  const loginPanelProps = useLoginPanelProps()
  return <LoginPage loginPanelProps={loginPanelProps} />
}

export const LoginRoute: MNRouteProps<Routes.Login> = {
  component: LoginRouteComponent,
  path: '/login',
  exact: true,
}
