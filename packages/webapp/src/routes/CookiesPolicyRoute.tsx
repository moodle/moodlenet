import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { CookiesPolicy } from '../ui/pages/Policies/CookiesPolicy/CookiesPolicy'
import { useCookiesPolicyCtrl } from '../ui/pages/Policies/CookiesPolicy/Ctrl/CookiesPolicyCtrl'
import { MNRouteProps, RouteFC } from './lib'

const CookiesPolicyComponent: RouteFC<Routes.CookiesPolicy> = (/* { match } */) => {
  const cookiesPolicyProps = ctrlHook(useCookiesPolicyCtrl, {}, 'cookies-policies-page')
  return <CookiesPolicy {...cookiesPolicyProps} />
}

export const CookiesPoliciesRoute: MNRouteProps<Routes.CookiesPolicy> = {
  component: CookiesPolicyComponent,
  path: '/cookies-policy',
  exact: true,
}
