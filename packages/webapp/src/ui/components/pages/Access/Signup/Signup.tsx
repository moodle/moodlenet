import { t, Trans } from '@lingui/macro'
import CallMadeIcon from '@material-ui/icons/CallMade'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import { isEmailAddress } from '../../../../../helpers/utilities'
import { Href, Link } from '../../../../elements/link'
import { CP, withCtrl } from '../../../../lib/ctrl'
import { FormikBag } from '../../../../lib/formik'
import Card from '../../../atoms/Card/Card'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import TertiaryButton from '../../../atoms/TertiaryButton/TertiaryButton'
import { MainPageWrapper, MainPageWrapperProps } from '../../../templates/MainPageWrapper'
import AccessHeader, { AccessHeaderProps } from '../AccessHeader/AccessHeader'
import './styles.scss'

export type SignupFormValues = { name: string; email: string; password: string }
export type SignupProps = {
  mainPageWrapperProps: CP<MainPageWrapperProps>
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
  formBag: FormikBag<SignupFormValues>
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
    formBag,
    requestSent,
    loginHref,
    signupErrorMessage,
    userAgreementHref,
  }) => {
    const [form, attrs] = formBag

    // const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    //   if (e.key === 'Enter') {
    //     form.submitForm()
    //   }
    // }

    const submitForm = () => {
      if (isEmailAddress(form.values.name)) {
        signupErrorMessage = 'Display name cannot be an email'
      } else {
        form.submitForm()
      }
    }

    return (
      <MainPageWrapper {...mainPageWrapperProps}>
        {/* <MainPageWrapper onKeyDown={handleKeyDown}> */}
        <div className={`signup-page ${requestSent ? 'success' : ''}`}>
          <AccessHeader {...accessHeaderProps} page={'signup'} />
          <div className={`signup-content ${requestSent ? 'success' : ''}`}>
            <Card>
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
                  <input
                    className="diplay-name"
                    type="text"
                    placeholder={t`Display name`}
                    {...attrs.name}
                    onChange={form.handleChange}
                  />
                  <input
                    className="email"
                    id="username_input"
                    color="text"
                    type="text"
                    placeholder={t`Email`}
                    {...attrs.email}
                    onChange={form.handleChange}
                  />
                  <input
                    className="password"
                    id="password_input"
                    type="password"
                    placeholder={t`Password`}
                    {...attrs.password}
                    onChange={form.handleChange}
                  />
                  <button id="signup-button" type="submit" style={{ display: 'none' }} />
                </form>
                {signupErrorMessage && <div className="error">{signupErrorMessage}</div>}
                <div className="bottom">
                  <div className="left">
                    <PrimaryButton onClick={submitForm}>
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
  },
)
