import { Routes } from '../../../common/lib/webapp/sitemap'
import { getUseActivateNewAccountPanelProps } from '../hooks/components/ActivateNewAccountPanel'
import { getUsePageHeaderProps } from '../hooks/components/HeaderElement'
import { useRedirectHomeIfLoggedIn } from '../hooks/glob/nav'
import { ActivateNewAccountPage } from '../ui/pages/ActivateNewAccount'
import { MNRouteProps, RouteFC } from './lib'

export const ActivateNewAccountComponent: RouteFC<Routes.ActivateNewAccount> = ({
  match: {
    params: { token },
  },
}) => {
  useRedirectHomeIfLoggedIn()

  const usePageHeaderProps = getUsePageHeaderProps()
  const useActivateNewAccountPanelProps = getUseActivateNewAccountPanelProps({ token })
  return (
    <ActivateNewAccountPage
      useActivateNewAccountPanelProps={useActivateNewAccountPanelProps}
      usePageHeaderProps={usePageHeaderProps}
    />
  )
}

export const ActivateNewAccountRoute: MNRouteProps<Routes.ActivateNewAccount> = {
  component: ActivateNewAccountComponent,
  path: '/activate-new-account/:token',
  exact: true,
}
