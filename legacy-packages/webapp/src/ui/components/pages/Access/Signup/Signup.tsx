import { t, Trans } from '@lingui/macro'
import CallMadeIcon from '@material-ui/icons/CallMade'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
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

export type SignupFormValues = { name: string; email: string; password: string }
export type SignupProps = {
  mainPageWrapperProps: CP<MainPageWrapperProps>
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
  form: FormikHandle<SignupFormValues>
  signupErrorMessage: string | null
  requestSent: boolean
  loginHref: Href
  landingHref: Href
  userAgreementHref: Href
}

export const Signup = withCtrl<SignupProps>(
  ({
    mainPageWrapperProps,
    accessHeaderProps,
    form,
    requestSent,
    loginHref,
    signupErrorMessage,
    userAgreementHref,
  }) => {
    const shouldShowErrors =
      !!form.submitCount && (!!signupErrorMessage || !form.isValid)

    return (
      <MainPageWrapper
        {...mainPageWrapperProps}
        style={{ background: '#f4f5f7' }}
      >
        {/* <MainPageWrapper onKeyDown={handleKeyDown}> */}
        <div className={`signup-page ${requestSent ? 'success' : ''}`}>
          <AccessHeader {...accessHeaderProps} page={'signup'} />
          <div className={`signup-content ${requestSent ? 'success' : ''}`}>
            <Card hover={true}>
              <Link href={loginHref}>
                <Trans>Log in</Trans>
                <CallMadeIcon />
              </Link>
            </Card>
            <Card>
              <div className="content">
                <div className="title">
                  <Trans>Sign up</Trans>
                </div>
                <form onSubmit={form.handleSubmit}>
                  <InputTextField
                    className="display-name"
                    placeholder={t`Display name`}
                    name="name"
                    edit
                    value={form.values.name}
                    onChange={form.handleChange}
                    error={shouldShowErrors && form.errors.name}
                  />
                  <InputTextField
                    className="email"
                    type="email"
                    placeholder={t`Email`}
                    name="email"
                    edit
                    value={form.values.email}
                    onChange={form.handleChange}
                    error={shouldShowErrors && form.errors.email}
                  />
                  <InputTextField
                    className="password"
                    type="password"
                    placeholder={t`Password`}
                    name="password"
                    edit
                    value={form.values.password}
                    onChange={form.handleChange}
                    error={shouldShowErrors && form.errors.password}
                  />
                  <button
                    id="signup-button"
                    type="submit"
                    style={{ display: 'none' }}
                  />
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
                      <Trans>Sign up</Trans>
                    </PrimaryButton>
                    <Link href={userAgreementHref} target="__blank">
                      <TertiaryButton>
                        <Trans>You agree to our Terms &amp; Conditions</Trans>
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
          </div>
          <div className={`success-content ${requestSent ? 'success' : ''}`}>
            <Card>
              <div className="content">
                <div className="title">
                  <Trans>Email sent!</Trans>
                </div>
                <MailOutlineIcon className="icon" />
                <div className="subtitle">
                  <Trans>Check out your inbox and activate your account</Trans>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </MainPageWrapper>
    )
  }
)
