import { Routes } from '../../../common/lib/webapp/sitemap'
import { useRedirectHomeIfLoggedIn } from '../hooks/glob/nav'
import { getUseActivateNewUserPanelProps } from '../hooks/useProps/ActivateNewUserPanel'
import { getUsePageHeaderProps } from '../hooks/useProps/HeaderElement'
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
