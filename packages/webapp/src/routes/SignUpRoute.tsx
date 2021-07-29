import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { useSignupCtrl } from '../ui/pages/Access/Signup/Ctrl/SignupCtrl'
import { Signup } from '../ui/pages/Access/Signup/Signup'
import { MNRouteProps, RouteFC } from './lib'

export const SignupRouteComponent: RouteFC<Routes.Signup> = (/* { match } */) => {
  const props = ctrlHook(useSignupCtrl, {})
  return <Signup {...props} />
}

export const SignupRoute: MNRouteProps<Routes.Signup> = {
  component: SignupRouteComponent,
  path: '/signup',
  exact: true,
}
