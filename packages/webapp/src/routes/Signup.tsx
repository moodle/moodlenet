import { Routes } from '../../../common/lib/webapp/sitemap'
import { getUseSignupPanelProps } from '../hooks/useProps/SignupPanel'
import { SignUpPage } from '../ui/pages/SignUp'
import { MNRouteProps, RouteFC } from './lib'

export const SignupRouteComponent: RouteFC<Routes.Signup> = (/* { match } */) => {
  const useSignupPanelProps = getUseSignupPanelProps()
  return <SignUpPage useSignupPanelProps={useSignupPanelProps} />
}

export const SignupRoute: MNRouteProps<Routes.Signup> = {
  component: SignupRouteComponent,
  path: '/signup',
  exact: true,
}
