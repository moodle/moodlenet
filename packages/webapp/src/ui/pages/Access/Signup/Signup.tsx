import { t, Trans } from '@lingui/macro'
import CallMadeIcon from '@material-ui/icons/CallMade'
import Card from '../../../components/atoms/Card/Card'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import TertiaryButton from '../../../components/atoms/TertiaryButton/TertiaryButton'
import { withCtrl } from '../../../lib/ctrl'
import { SubmitForm, useFormikBag } from '../../../lib/formik'
import { MainPageWrapper } from '../../../templates/page/MainPageWrapper'
import AccessHeader, { AccessHeaderProps } from '../AccessHeader/AccessHeader'
import './styles.scss'

export type SignupFormValues = { email: string; username: string }
export type SignupProps = {
  accessHeaderProps: AccessHeaderProps
  onSubmit: SubmitForm<SignupFormValues>
  signupErrorMessage: string | null
  requestSent: boolean
}

export const Signup = withCtrl<SignupProps>(({ accessHeaderProps, onSubmit }) => {
  const [form, attrs] = useFormikBag({ initialValues: { email: '', username: '' }, onSubmit })
  return (
    <MainPageWrapper>
      <div className="signup-page">
        <AccessHeader {...accessHeaderProps} />
        <div className="separator" />
        <div className="content">
          <Card>
            Sign in
            <CallMadeIcon />
          </Card>
          <Card>
            <div className="content">
              <div className="title">
                <Trans>Sign up</Trans>
              </div>
              <form>
                <input
                  className="email"
                  type="text"
                  placeholder={t`Email`}
                  {...attrs.email}
                  onChange={form.handleChange}
                />
                <input
                  className="username"
                  type="text"
                  placeholder={t`Username`}
                  {...attrs.username}
                  onChange={form.handleChange}
                />
              </form>
              <div className="bottom">
                <div className="left">
                  <PrimaryButton onClick={form.submitForm}>
                    <Trans>Next</Trans>
                  </PrimaryButton>
                  <TertiaryButton>
                    <Trans>or browse now!</Trans>
                  </TertiaryButton>
                </div>
                <div className="right">
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
      </div>
    </MainPageWrapper>
  )
})
Signup.displayName = 'SignUpPage'
