import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { CookiesPolicy } from '../ui/pages/Policies/CookiesPolicy/CookiesPolicy'
import { useCookiesPoliciesCtrl } from '../ui/pages/Policies/CookiesPolicy/Ctrl/CookiesPolicyCtrl'
import { MNRouteProps, RouteFC } from './lib'

const CookiesPoliciesComponent: RouteFC<Routes.CookiesPolicies> = (/* { match } */) => {
  const cookiesPolicyProps = ctrlHook(useCookiesPoliciesCtrl, {}, 'cookies-policies-page')
  return <CookiesPolicy {...cookiesPolicyProps} />
}

export const CookiesPoliciesRoute: MNRouteProps<Routes.CookiesPolicies> = {
  component: CookiesPoliciesComponent,
  path: '/cookies-policies',
  exact: true,
}
