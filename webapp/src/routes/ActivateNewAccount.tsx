import { ActivateNewAccountPageCtrl } from '../ctrl/pages/ActivateNewAccountPageCtrl'
import { ActivateNewAccountRouteDef } from '../sitemap'
import { MNRouteProps, RouteFC } from '../sitemap/lib'

export const ActivateNewAccountComponent: RouteFC<ActivateNewAccountRouteDef> = ({
  match: {
    params: { token },
  },
}) => {
  return <ActivateNewAccountPageCtrl token={token} />
}

export const ActivateNewAccountRoute: MNRouteProps<ActivateNewAccountRouteDef> = {
  component: ActivateNewAccountComponent,
  path: '/activate-new-account/:token',
  exact: true,
}
