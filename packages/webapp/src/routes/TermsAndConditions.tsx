import { Routes } from '../../../common/lib/webapp/sitemap'
import { TermsAndConditionsPageCtrl } from '../ctrl/pages/TermsAndConditionsPageCtrl'
import { MNRouteProps, RouteFC } from './lib'

export const TermsAndConditionsRouteComponent: RouteFC<Routes.TermsAndConditions> = (/* { match } */) => {
  return <TermsAndConditionsPageCtrl />
}

export const TermsAndConditionsRoute: MNRouteProps<Routes.TermsAndConditions> = {
  component: TermsAndConditionsRouteComponent,
  path: '/terms',
  exact: true,
}
