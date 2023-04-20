import { PrimaryButton, TertiaryButton } from '@moodlenet/component-library'
import { Href } from '@moodlenet/react-app/common'
import { Link } from '@moodlenet/react-app/ui'
import { Person } from '@mui/icons-material'
import { FC } from 'react'

export type AccessButtonsProps = {
  loginHref: Href
  signupHref: Href
}

export const AccessButtons: FC<AccessButtonsProps> = ({ loginHref, signupHref }) => {
  return (
    <>
      <Link href={loginHref} key="login-button" className="login-button access-button">
        <PrimaryButton>
          {/* <Trans> */}
          <span>Login</span>
          {/* </Trans> */}
          <Person />
        </PrimaryButton>
      </Link>
      <Link href={signupHref} key="signup-button" className="signup-button access-button">
        <TertiaryButton>
          {/* <Trans> */}
          Join now
          {/* </Trans> */}
        </TertiaryButton>
      </Link>
    </>
  )
}
