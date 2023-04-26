import { SecondaryButton } from '@moodlenet/component-library'
import { Href } from '@moodlenet/react-app/common'
import { Link } from '@moodlenet/react-app/ui'

import { FC } from 'react'
import './MinimalisticAccessButtons.scss'

export const SignupButtonMini: FC<{ signupHref: Href }> = ({ signupHref }) => (
  <Link href={signupHref}>
    <SecondaryButton color="orange">Sign up</SecondaryButton>
  </Link>
)

export const LoginButtonMini: FC<{ loginHref: Href }> = ({ loginHref }) => (
  <Link href={loginHref}>
    <SecondaryButton color="orange">Log in</SecondaryButton>
  </Link>
)
