import { t, Trans } from '@lingui/macro'
import Card from '../../../components/atoms/Card/Card'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import { CP, withCtrl } from '../../../lib/ctrl'
import { FormikBag } from '../../../lib/formik'
import { MainPageWrapper } from '../../../templates/page/MainPageWrapper'
import AccessHeader, { AccessHeaderProps } from '../AccessHeader/AccessHeader'
import './styles.scss'

export type NewPasswordFormValues = { name: string; password: string }
export type NewPasswordProps = {
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
  formBag: FormikBag<NewPasswordFormValues>
  newPasswordErrorMessage: string | null
}

export const NewPassword = withCtrl<NewPasswordProps>(({ accessHeaderProps, newPasswordErrorMessage, formBag }) => {
  const [form, attrs] = formBag
  return (
    <MainPageWrapper>
      <div className="new-password-page">
        <AccessHeader {...accessHeaderProps} page={'login'} />
        <div className="separator" />
        <div className="main-content">
          <Card>
            <div className="content">
              <div className="title">
                <Trans>Update password</Trans>
              </div>
              <form>
                <input
                  className="password"
                  type="text"
                  placeholder={t`New password`}
                  {...attrs.name}
                  onChange={form.handleChange}
                />
                {newPasswordErrorMessage && <div className="error">{newPasswordErrorMessage}</div>}
              </form>
              <div className="bottom">
                <div className="left">
                  <PrimaryButton onClick={form.submitForm}>
                    <Trans>Change password</Trans>
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainPageWrapper>
  )
})
NewPassword.displayName = 'SignUpPage'
