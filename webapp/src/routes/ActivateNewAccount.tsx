import { ActivateNewAccountRouteDef } from '../sitemap';
import { MNRouteProps, RouteFC } from '../sitemap/lib';

export const ActivateNewAccountComponent: RouteFC<ActivateNewAccountRouteDef> = ({
  match: {
    params: { token }
  }
}) => {
  return <div>ActivateNewAccount {token}</div>;
};

export const ActivateNewAccountRoute: MNRouteProps<ActivateNewAccountRouteDef> = {
  component: ActivateNewAccountComponent,
  path: '/activate-new-account/:token',
  exact: true
};
