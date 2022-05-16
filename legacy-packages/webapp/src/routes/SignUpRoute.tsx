import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { useSignupCtrl } from '../ui/components/pages/Access/Signup/Ctrl/SignupCtrl'
import { Signup } from '../ui/components/pages/Access/Signup/Signup'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

export const SignupRouteComponent: RouteFC<
  Routes.Signup
> = (/* { match } */) => {
  const props = ctrlHook(useSignupCtrl, {}, 'signup-route')
  return <Signup {...props} />
}

export const SignupRoute: MNRouteProps<Routes.Signup> = {
  component: SignupRouteComponent,
  path: '/signup',
  exact: true,
}
