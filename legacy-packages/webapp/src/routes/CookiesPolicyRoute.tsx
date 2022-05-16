import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { CookiesPolicy } from '../ui/components/pages/Policies/CookiesPolicy/CookiesPolicy'
import { useCookiesPolicyCtrl } from '../ui/components/pages/Policies/CookiesPolicy/Ctrl/CookiesPolicyCtrl'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

const CookiesPolicyComponent: RouteFC<
  Routes.CookiesPolicy
> = (/* { match } */) => {
  const cookiesPolicyProps = ctrlHook(
    useCookiesPolicyCtrl,
    {},
    'cookies-policies-page'
  )
  return <CookiesPolicy {...cookiesPolicyProps} />
}

export const CookiesPoliciesRoute: MNRouteProps<Routes.CookiesPolicy> = {
  component: CookiesPolicyComponent,
  path: '/cookies-policy',
  exact: true,
}
