import CallMadeIcon from '@material-ui/icons/CallMade'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import { FC } from 'react'
import Card from '../../../atoms/Card/Card'
import { InputTextField } from '../../../atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import TertiaryButton from '../../../atoms/TertiaryButton/TertiaryButton'
import { MainLayout } from '../../../layout'
import './Signup.scss'

export type SignupFormValues = { name: string; email: string; password: string }
export type SignupProps = {}

export const Signup: FC<SignupProps> = () => {
  return (
    <MainLayout headerType="minimalistic">
      <SignupBody />
    </MainLayout>
  )
}
export const SignupBody: FC<SignupProps> = ({}) => {
  // const shouldShowErrors =
  //   !!form.submitCount && (!!signupErrorMessage || !form.isValid)

  return (
    <div className={`signup-page`}>
      {/* <div className={`signup-page ${requestSent ? 'success' : ''}`} onKeyDown={handleKeyDown}> */}
      <div className={`signup-content`}>
        {/* <div className={`signup-content ${requestSent ? 'success' : ''}`}> */}
        <Card hover={true}>
          {/* <Link href={SignupHref}> */}
          <a>
            Log in
            <CallMadeIcon />
          </a>
          {/* </Link> */}
        </Card>
        <Card>
          <div className="content">
            <div className="title">Sign up</div>
            <form /* onSubmit={form.handleSubmit} */>
              <InputTextField
                className="display-name"
                placeholder={`Display name`}
                name="name"
                edit
                // value={form.values.name}
                // onChange={form.handleChange}
                // error={shouldShowErrors && form.errors.name}
              />
              <InputTextField
                className="email"
                type="email"
                placeholder={`Email`}
                name="email"
                edit
                // value={form.values.email}
                // onChange={form.handleChange}
                // error={shouldShowErrors && form.errors.email}
              />
              <InputTextField
                className="password"
                type="password"
                placeholder={`Password`}
                name="password"
                edit
                // value={form.values.password}
                // onChange={form.handleChange}
                // error={shouldShowErrors && form.errors.password}
              />
              <button id="signup-button" type="submit" style={{ display: 'none' }} />
            </form>
            <div className="bottom">
              <div className="left">
                <PrimaryButton
                /* onClick={
                        form.isSubmitting || form.isValidating
                          ? undefined
                          : form.submitForm
                      } */
                >
                  Sign up
                </PrimaryButton>
                {/* <Link href={userAgreementHref} target="__blank"> */}
                <a>
                  <TertiaryButton>You agree to our Terms &amp; Conditions</TertiaryButton>
                </a>
                {/* </Link> */}
              </div>
              {/* <div className="right" hidden>
                <div className="icon">
                  <img
                    alt="apple Signup"
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                  />
                </div>
                <div className="icon">
                  <img
                    alt="google Signup"
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  />
                </div>
              </div> */}
            </div>
          </div>
        </Card>
      </div>
      <div className={`success-content`}>
        {/* <div className={`success-content ${requestSent ? 'success' : ''}`}> */}
        <Card>
          <div className="content">
            <div className="title">Email sent!</div>
            <MailOutlineIcon className="icon" />
            <div className="subtitle">Check out your inbox and activate your account</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
