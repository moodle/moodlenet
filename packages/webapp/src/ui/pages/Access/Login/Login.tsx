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

export type LoginFormValues = { username: string; password: string }
export type LoginProps = {
  accessHeaderProps: AccessHeaderProps
  onSubmit: SubmitForm<LoginFormValues>
  loginErrorMessage: string | null
}

export const Login = withCtrl<LoginProps>(({ accessHeaderProps, onSubmit }) => {
  const [form, attrs] = useFormikBag({ initialValues: { username: '', password: '' }, onSubmit })
  return (
    <MainPageWrapper>
      <div className="login-page">
        <AccessHeader {...accessHeaderProps} page={'login'}/>
        <div className="separator" />
        <div className="content">
          <Card>
            <div className="content">
              <div className="title">
                <Trans>Login</Trans>
              </div>
              <form>
                <input
                  className="email"
                  type="text"
                  placeholder={t`Email`}
                  {...attrs.username}
                  onChange={form.handleChange}
                />
                <input
                  className="password"
                  type="password"
                  placeholder={t`Password`}
                  {...attrs.password}
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
            Sign up
            <CallMadeIcon />
          </Card>
        </div>
      </div>
    </MainPageWrapper>
  )
})
Login.displayName = 'LoginPage'
