import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { ActivateNewAccountPageCtrl } from '../ctrl/pages/ActivateNewAccountPageCtrl'
import { MNRouteProps, RouteFC } from './lib'

export const ActivateNewAccountComponent: RouteFC<Routes.ActivateNewAccount> = ({
  match: {
    params: { token },
  },
}) => {
  return <ActivateNewAccountPageCtrl token={token} />
}

export const ActivateNewAccountRoute: MNRouteProps<Routes.ActivateNewAccount> = {
  component: ActivateNewAccountComponent,
  path: '/activate-new-account/:token',
  exact: true,
}
