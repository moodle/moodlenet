import { href } from '@moodlenet/react-app/common'
import type { FC } from 'react'
import {
  LoginHeaderButton,
  SignupHeaderButton,
} from '../../../ui/components/molecules/AccessButtons/AccessButtons.js'

export const LoginButtonContainer: FC = () => <LoginHeaderButton loginHref={href('/login')} />
export const SignupButtonContainer: FC = () => <SignupHeaderButton signupHref={href('/signup')} />
