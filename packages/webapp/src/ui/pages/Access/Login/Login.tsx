import { t, Trans } from '@lingui/macro'
import CallMadeIcon from '@material-ui/icons/CallMade'
import React from 'react'
import Card from '../../../components/atoms/Card/Card'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import TertiaryButton from '../../../components/atoms/TertiaryButton/TertiaryButton'
import { Href, Link } from '../../../elements/link'
import { CP, withCtrl } from '../../../lib/ctrl'
import { FormikBag } from '../../../lib/formik'
import { MainPageWrapper } from '../../../templates/page/MainPageWrapper'
import AccessHeader, { AccessHeaderProps } from '../AccessHeader/AccessHeader'
import './styles.scss'

export type LoginFormValues = { email: string; password: string }
export type LoginProps = {
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
  formBag: FormikBag<LoginFormValues>
  wrongCreds: boolean
  signupHref: Href
  // landingHref: Href
  recoverPasswordHref: Href
}

export const Login = withCtrl<LoginProps>(
  ({ accessHeaderProps, formBag, signupHref, recoverPasswordHref, wrongCreds }) => {
    const [form, attrs] = formBag

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        form.submitForm()
      }
    }

    return (
      <MainPageWrapper onKeyDown={handleKeyDown}>
        <div className="login-page">
          <AccessHeader {...accessHeaderProps} page={'login'} />
          <div className="separator" />
          <div className="content">
            <Card>
              <div className="content">
                <div className="title">
                  <Trans>Log in</Trans>
                </div>
                <form onSubmit={form.handleSubmit}>
                  <input
                    className="email"
                    type="text"
                    placeholder={t`Email`}
                    {...attrs.email}
                    onChange={form.handleChange}
                  />
                  <input
                    className="password"
                    type="password"
                    placeholder={t`Password`}
                    {...attrs.password}
                    onChange={form.handleChange}
                  />
                  <button type="submit" style={{ display: 'none' }} />
                </form>
                {wrongCreds && (
                  <div className="error">
                    <Trans>Incorrect username or password</Trans>
                  </div>
                )}
                <div className="bottom">
                  <div className="left">
                    <PrimaryButton onClick={form.submitForm}>
                      <Trans>Next</Trans>
                    </PrimaryButton>
                    <Link href={recoverPasswordHref}>
                      <TertiaryButton>
                        <Trans>or recover password</Trans>
                      </TertiaryButton>
                    </Link>
                  </div>
                  <div className="right" hidden>
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
                  </div>
                </div>
              </div>
            </Card>
            <Card>
              <Link href={signupHref}>
                Sign up
                <CallMadeIcon />
              </Link>
            </Card>
          </div>
        </div>
      </MainPageWrapper>
    )
  },
)
Login.displayName = 'LoginPage'
