import { Routes } from '../../../common/lib/webapp/sitemap'
import { useSignupPanelProps } from '../hooks/props/SignupPanel'
import { SignUpPage } from '../ui/pages/SignUp'
import { MNRouteProps, RouteFC } from './lib'

export const SignupRouteComponent: RouteFC<Routes.Signup> = (/* { match } */) => {
  const signupPanelProps = useSignupPanelProps()
  return <SignUpPage signupPanelProps={signupPanelProps} />
}

export const SignupRoute: MNRouteProps<Routes.Signup> = {
  component: SignupRouteComponent,
  path: '/signup',
  exact: true,
}
