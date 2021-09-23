import { t, Trans } from '@lingui/macro'
import CallMadeIcon from '@material-ui/icons/CallMade'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import Card from '../../../components/atoms/Card/Card'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import { Href, Link } from '../../../elements/link'
import { CP, withCtrl } from '../../../lib/ctrl'
import { FormikBag } from '../../../lib/formik'
import { MainPageWrapper, MainPageWrapperProps } from '../../../templates/page/MainPageWrapper'
import AccessHeader, { AccessHeaderProps } from '../AccessHeader/AccessHeader'
import './styles.scss'

export type RecoverPasswordFormValues = { email: string }
export type RecoverPasswordProps = {
  mainPageWrapperProps: CP<MainPageWrapperProps>
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
  formBag: FormikBag<RecoverPasswordFormValues>
  RecoverPasswordErrorMessage: string | null
  requestSent: boolean
  loginHref: Href
  landingHref: Href
}

export const RecoverPassword = withCtrl<RecoverPasswordProps>(
  ({ mainPageWrapperProps, accessHeaderProps, formBag, requestSent, loginHref, RecoverPasswordErrorMessage }) => {
    const [form, attrs] = formBag

    // const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    //   if (e.key === 'Enter') {
    //     form.submitForm()
    //   }
    // }

    return (
      <MainPageWrapper {...mainPageWrapperProps}>
        {/* <MainPageWrapper onKeyDown={handleKeyDown}> */}
        <div className={`recover-password-page ${requestSent ? 'success' : ''}`}>
          <AccessHeader {...accessHeaderProps} page={'login'} />
          <div className={`recover-password-content ${requestSent ? 'success' : ''}`}>
            <Card>
              <Link href={loginHref}>
                <Trans>Log in</Trans>
                <CallMadeIcon />
              </Link>
            </Card>
            <Card>
              <div className="content">
                <div className="title">
                  <Trans>Recover password</Trans>
                </div>
                <form onSubmit={form.handleSubmit}>
                  <input
                    className="email"
                    color="text"
                    placeholder={t`Email`}
                    {...attrs.email}
                    onChange={form.handleChange}
                  />
                  <button type="submit" style={{ display: 'none' }} />
                  {RecoverPasswordErrorMessage && <div className="error">{RecoverPasswordErrorMessage}</div>}
                </form>
                <div className="bottom">
                  <div className="left">
                    <PrimaryButton onClick={form.submitForm}>
                      <Trans>Next</Trans>
                    </PrimaryButton>
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
                <MailOutlineIcon className="icon" />
                <div className="subtitle">
                  <Trans>
                    If the email you provided corresponds to a MoodleNet user, you'll receive an email with a change
                    password link
                  </Trans>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </MainPageWrapper>
    )
  },
)
