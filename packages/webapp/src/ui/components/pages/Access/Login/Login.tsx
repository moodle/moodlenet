import { t, Trans } from '@lingui/macro'
import CallMadeIcon from '@material-ui/icons/CallMade'
import React from 'react'
import { Href, Link } from '../../../../elements/link'
import { CP, withCtrl } from '../../../../lib/ctrl'
import { FormikBag } from '../../../../lib/formik'
import Card from '../../../atoms/Card/Card'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import TertiaryButton from '../../../atoms/TertiaryButton/TertiaryButton'
import {
  MainPageWrapper,
  MainPageWrapperProps,
} from '../../../templates/MainPageWrapper'
import AccessHeader, { AccessHeaderProps } from '../AccessHeader/AccessHeader'
import './styles.scss'

export type LoginFormValues = { email: string; password: string }
export type LoginProps = {
  mainPageWrapperProps: CP<MainPageWrapperProps>
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
  formBag: FormikBag<LoginFormValues>
  wrongCreds: boolean
  signupHref: Href
  // landingHref: Href
  recoverPasswordHref: Href
}

export const Login = withCtrl<LoginProps>(
  ({
    accessHeaderProps,
    formBag,
    signupHref,
    wrongCreds,
    recoverPasswordHref,
    mainPageWrapperProps,
  }) => {
    const [form, attrs] = formBag

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        form.submitForm()
        console.log('submiting form')
      }
    }

    const shouldShowErrors = !!form.submitCount && (wrongCreds || !form.isValid)

    return (
      <MainPageWrapper
        {...mainPageWrapperProps}
        onKeyDown={handleKeyDown}
        style={{ background: '#f4f5f7' }}
      >
        <div className="login-page">
          <AccessHeader {...accessHeaderProps} page={'login'} />
          <div className="content">
            <Card>
              <div className="content">
                <div className="title">
                  <Trans>Log in</Trans>
                </div>
                <form onSubmit={form.handleSubmit}>
                  <input
                    className={`email ${
                      shouldShowErrors && form.errors.email ? 'highlight' : ''
                    }`}
                    type="text"
                    placeholder={t`Email`}
                    {...attrs.email}
                    onChange={form.handleChange}
                  />
                  {shouldShowErrors && form.errors.email && (
                    <div className="error">{form.errors.email}</div>
                  )}
                  <input
                    className={`password ${
                      shouldShowErrors && form.errors.password
                        ? 'highlight'
                        : ''
                    }`}
                    type="password"
                    placeholder={t`Password`}
                    {...attrs.password}
                    onChange={form.handleChange}
                  />
                  {shouldShowErrors && form.errors.password && (
                    <div className="error">{form.errors.password}</div>
                  )}
                  <button type="submit" style={{ display: 'none' }} />
                  {wrongCreds && (
                    <div className="error">
                      <Trans>Incorrect username or password</Trans>
                    </div>
                  )}
                </form>
                <div className="bottom">
                  <div className="left">
                    <PrimaryButton
                      onClick={
                        form.isSubmitting || form.isValidating
                          ? undefined
                          : form.submitForm
                      }
                    >
                      <Trans>Log in</Trans>
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
  }
)
Login.displayName = 'LoginPage'
