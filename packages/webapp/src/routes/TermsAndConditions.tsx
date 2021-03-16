import { Routes } from '../../../common/lib/webapp/sitemap'
import { TermsAndConditionsPage } from '../ui/pages/TermsAndConditions'
import { MNRouteProps, RouteFC } from './lib'

export const TermsAndConditionsRouteComponent: RouteFC<Routes.TermsAndConditions> = (/* { match } */) => {
  return <TermsAndConditionsPage />
}

export const TermsAndConditionsRoute: MNRouteProps<Routes.TermsAndConditions> = {
  component: TermsAndConditionsRouteComponent,
  path: '/terms',
  exact: true,
}
