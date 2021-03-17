import { Routes } from '../../../common/lib/webapp/sitemap'
import { getUseLoginPanelProps } from '../hooks/components/LoginPanelBig'
import { useRedirectHomeIfLoggedIn } from '../hooks/glob/nav'
import { LoginPage } from '../ui/pages/Login'
import { MNRouteProps, RouteFC } from './lib'

export const LoginRouteComponent: RouteFC<Routes.Login> = (/* { match } */) => {
  useRedirectHomeIfLoggedIn()
  const useLoginPanelProps = getUseLoginPanelProps()
  return <LoginPage useLoginPanelProps={useLoginPanelProps} />
}

export const LoginRoute: MNRouteProps<Routes.Login> = {
  component: LoginRouteComponent,
  path: '/login',
  exact: true,
}
