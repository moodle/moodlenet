import { Routes } from '../../../common/lib/webapp/sitemap'
import { useRedirectHomeIfLoggedIn } from '../hooks/glob/nav'
import { getUseLoginPanelProps } from '../hooks/useProps/LoginPanelBig'
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
