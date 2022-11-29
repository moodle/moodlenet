import { t, Trans } from '@lingui/macro'
import CallMadeIcon from '@material-ui/icons/CallMade'
import React from 'react'
import { Href, Link } from '../../../../elements/link'
import { CP, withCtrl } from '../../../../lib/ctrl'
import { FormikHandle } from '../../../../lib/formik'
import Card from '../../../atoms/Card/Card'
import { InputTextField } from '../../../atoms/InputTextField/InputTextField'
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
  form: FormikHandle<LoginFormValues>
  wrongCreds: boolean
  signupHref: Href
  // landingHref: Href
  recoverPasswordHref: Href
}

export const Login = withCtrl<LoginProps>(
  ({
    accessHeaderProps,
    form,
    signupHref,
    wrongCreds,
    recoverPasswordHref,
    mainPageWrapperProps,
  }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        form.submitForm()
      }
    }

    const shouldShowErrors = !!form.submitCount && (wrongCreds || !form.isValid)
    // console.log({
    //   submitCount: form.submitCount,
    //   wrongCreds,
    //   isValid: form.isValid,
    // })

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
                  <InputTextField
                    className="email"
                    placeholder={t`Email`}
                    type="email"
                    name="email"
                    edit
                    value={form.values.email}
                    onChange={form.handleChange}
                    error={shouldShowErrors && form.errors.email}
                  />
                  <InputTextField
                    className="password"
                    placeholder={t`Password`}
                    type="password"
                    name="password"
                    edit
                    value={form.values.password}
                    onChange={form.handleChange}
                    error={shouldShowErrors && form.errors.password}
                  />
                  {wrongCreds && (
                    <div className="error">
                      <Trans>Incorrect username or password</Trans>
                    </div>
                  )}
                  <button type="submit" style={{ display: 'none' }} />
                </form>
                <div className="bottom">
                  <div className="content">
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
              </div>
            </Card>
            <Card hover={true}>
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
