import { AddonItem, PrimaryButton, TertiaryButton } from '@moodlenet/component-library'
import { Href } from '@moodlenet/react-app/common'
import { Link } from '@moodlenet/react-app/ui'
import { Person } from '@mui/icons-material'

export type AccessButtonsProps = {
  loginHref: Href
  signupHref: Href
}

export const getAccessButtons = (props: AccessButtonsProps): AddonItem[] => {
  const { loginHref, signupHref } = props
  return [
    {
      Item: () => (
        <Link href={loginHref} key="login-button" className="login-button access-button">
          <PrimaryButton>
            {/* <Trans> */}
            <span>Login</span>
            {/* </Trans> */}
            <Person />
          </PrimaryButton>
        </Link>
      ),
      key: '',
    },
    {
      Item: () => (
        <Link href={signupHref} key="signup-button" className="signup-button access-button">
          <TertiaryButton>
            {/* <Trans> */}
            Join now
            {/* </Trans> */}
          </TertiaryButton>
        </Link>
      ),
      key: '',
    },
  ]
}
