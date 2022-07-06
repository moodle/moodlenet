import CallMadeIcon from '@material-ui/icons/CallMade'
import { FC } from 'react'
import { Link } from 'react-router-dom'
// import { Link } from '../../../../elements/link'
import Card from '../../../atoms/Card/Card'
import { InputTextField } from '../../../atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import TertiaryButton from '../../../atoms/TertiaryButton/TertiaryButton'
import { MainLayout } from '../../../layout'
import './Login.scss'

export type LoginFormValues = { email: string; password: string }
export type LoginProps = {}

export const Login: FC<LoginProps> = () => {
  return (
    <MainLayout headerType="minimalistic">
      <LoginBody />
    </MainLayout>
  )
}
export const LoginBody: FC<LoginProps> = ({}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      // form.submitForm()
    }
  }

  // const shouldShowErrors = !!form.submitCount && (wrongCreds || !form.isValid)
  // console.log({
  //   submitCount: form.submitCount,
  //   wrongCreds,
  //   isValid: form.isValid,
  // })

  return (
    <div className="login-page">
      <div className="content">
        <Card>
          <div className="content">
            <div className="title">Log in</div>
            <form
            // onSubmit={form.handleSubmit}
            >
              <InputTextField
                className="email"
                placeholder={`Email`}
                type="email"
                name="email"
                edit
                // value={form.values.email}
                // onChange={form.handleChange}
                // error={shouldShowErrors && form.errors.email}
              />
              <InputTextField
                className="password"
                placeholder={`Password`}
                type="password"
                name="password"
                edit
                // value={form.values.password}
                // onChange={form.handleChange}
                // error={shouldShowErrors && form.errors.password}
              />
              {/* {wrongCreds && (
                    <div className="error">
                      <Trans>Incorrect username or password</Trans>
                    </div>
                  )} */}
              <button type="submit" style={{ display: 'none' }} />
            </form>
            <div className="bottom">
              <div className="content">
                <div className="left">
                  <PrimaryButton
                    onClick={() => alert('Nothing to see here, for the moment 🤫')}
                    // onClick={
                    //   form.isSubmitting || form.isValidating
                    //     ? undefined
                    //     : form.submitForm
                    // }
                  >
                    Log in
                  </PrimaryButton>
                  {/* <Link href={``}> */}
                  <TertiaryButton>or recover password</TertiaryButton>
                  {/* </Link> */}
                </div>
                {/* <div className="right" hidden>
                  <div className="icon">
                    <img
                      alt="apple login"
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                    />
                  </div>
                  <div className="icon">
                    <img
                      alt="google login"
                      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                    />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </Card>
        <Card hover={true}>
          <Link to={`/signup/email`}>
            Sign up
            <CallMadeIcon />
          </Link>
        </Card>
      </div>
    </div>
  )
}

Login.displayName = 'LoginPage'
