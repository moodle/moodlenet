import type { AddonItem } from '@moodlenet/component-library'
import type { Href } from '@moodlenet/react-app/common'
import { LoginHeaderButton, SignupHeaderButton } from './AccessButtons.js'

export type AccessButtonsProps = {
  loginHref: Href
  signupHref: Href
}

export const getAccessButtons = (props: AccessButtonsProps): AddonItem[] => {
  const { loginHref, signupHref } = props
  return [
    {
      Item: () => <LoginHeaderButton loginHref={loginHref} />,
      key: '',
    },
    {
      Item: () => <SignupHeaderButton signupHref={signupHref} />,
      key: '',
    },
  ]
}
