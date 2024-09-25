import { href } from '@moodlenet/react-app/common'
import type { FC } from 'react'
import {
  SIGNUP_PAGE_ROUTE_BASE_PATH,
  useLoginPageRoutePathRedirectToCurrent,
} from '../../../../common/webapp-routes.mjs'
import {
  LoginHeaderButton,
  SignupHeaderButton,
} from '../../../ui/components/molecules/AccessButtons/AccessButtons'

export const LoginButtonContainer: FC = () => {
  return <LoginHeaderButton loginHref={href(useLoginPageRoutePathRedirectToCurrent())} />
}
export const SignupButtonContainer: FC = () => {
  return <SignupHeaderButton signupHref={href(SIGNUP_PAGE_ROUTE_BASE_PATH)} />
}
