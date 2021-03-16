import { Routes } from '../../../common/lib/webapp/sitemap'
import { getUseActivateNewUserPanelProps } from '../hooks/components/ActivateNewUserPanel'
import { getUsePageHeaderProps } from '../hooks/components/HeaderElement'
import { useRedirectHomeIfLoggedIn } from '../hooks/glob/nav'
import { ActivateNewUserPage } from '../ui/pages/ActivateNewUser'
import { MNRouteProps, RouteFC } from './lib'

export const ActivateNewUserComponent: RouteFC<Routes.ActivateNewUser> = ({
  match: {
    params: { token },
  },
}) => {
  useRedirectHomeIfLoggedIn()

  const usePageHeaderProps = getUsePageHeaderProps()
  const useActivateNewUserPanelProps = getUseActivateNewUserPanelProps({ token })
  return (
    <ActivateNewUserPage
      useActivateNewUserPanelProps={useActivateNewUserPanelProps}
      usePageHeaderProps={usePageHeaderProps}
    />
  )
}

export const ActivateNewUserRoute: MNRouteProps<Routes.ActivateNewUser> = {
  component: ActivateNewUserComponent,
  path: '/activate-new-user/:token',
  exact: true,
}
