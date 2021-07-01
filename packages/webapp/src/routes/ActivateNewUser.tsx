import { Routes } from '../../../common/lib/webapp/sitemap'
import { useRedirectHomeIfLoggedIn } from '../hooks/glob/nav'
import { useActivateNewUserPanelProps } from '../hooks/props/ActivateNewUserPanel'
import { ActivateNewUserPage } from '../ui/pages/ActivateNewUser/ActivateNewUser'
import { MNRouteProps, RouteFC } from './lib'

export const ActivateNewUserComponent: RouteFC<Routes.ActivateNewUser> = ({
  match: {
    params: { token },
  },
}) => {
  useRedirectHomeIfLoggedIn()

  const activateNewUserPanelProps = useActivateNewUserPanelProps({ token })
  return <ActivateNewUserPage ActivateNewUserPanelCtrl={activateNewUserPanelProps} />
}

export const ActivateNewUserRoute: MNRouteProps<Routes.ActivateNewUser> = {
  component: ActivateNewUserComponent,
  path: '/activate-new-user/:token',
  exact: true,
}
