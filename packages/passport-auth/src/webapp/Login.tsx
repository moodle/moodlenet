import { PrimaryButton, SecondaryButton } from '@moodlenet/component-library'
import { FC, useContext } from 'react'
import './Login.scss'
import { PassportContext } from './MainModule'

export type LoginFormValues = { email: string; password: string }

export const Icon: FC = () => (
  <span>
    <PrimaryButton color="blue">Other methods</PrimaryButton>
  </span>
)
export const Panel: FC = () => {
  const { configFlags } = useContext(PassportContext)

  return (
    <>
      {configFlags.google && (
        <a href="/_/@moodlenet/passport-auth/login/federated/google">
          <SecondaryButton className="alternative-login-btn google" color="light-grey">
            <div className="icon">
              <img
                alt="google login"
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              />
            </div>
            <div className="title">Login using Google</div>
          </SecondaryButton>
        </a>
      )}
      <SecondaryButton className="alternative-login-btn facebook" color="light-grey">
        <div className="icon">
          <img
            alt="facebook login"
            src="https://d35aaqx5ub95lt.cloudfront.net/images/facebook-blue.svg"
          />
        </div>
        <div className="title">Login using Facebook</div>
      </SecondaryButton>
      <SecondaryButton className="alternative-login-btn twitter" color="light-grey">
        <div className="icon">
          <img
            alt="twitter login"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/512px-Twitter-logo.svg.png?20211104142029"
          />
        </div>
        <div className="title">Login using Twitter</div>
      </SecondaryButton>
    </>
  )
}

// function unimplemented() {
//   alert('not implemented')
// }
