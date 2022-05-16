import { t, Trans } from '@lingui/macro'
import { CP, withCtrl } from '../../../../lib/ctrl'
import { FormikHandle } from '../../../../lib/formik'
import Card from '../../../atoms/Card/Card'
import { InputTextField } from '../../../atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import {
  MainPageWrapper,
  MainPageWrapperProps,
} from '../../../templates/MainPageWrapper'
import AccessHeader, { AccessHeaderProps } from '../AccessHeader/AccessHeader'
import './styles.scss'

export type NewPasswordFormValues = { newPassword: string }
export type NewPasswordProps = {
  mainPageWrapperProps: CP<MainPageWrapperProps>
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
  form: FormikHandle<NewPasswordFormValues>
  newPasswordErrorMessage: string | null
}

export const NewPassword = withCtrl<NewPasswordProps>(
  ({
    mainPageWrapperProps,
    accessHeaderProps,
    newPasswordErrorMessage,
    form,
  }) => {
    const shouldShowErrors =
      !!form.submitCount && (newPasswordErrorMessage || !form.isValid)

    return (
      <MainPageWrapper {...mainPageWrapperProps}>
        <div className="new-password-page">
          <AccessHeader {...accessHeaderProps} page={'login'} />
          <div className="main-content">
            <Card>
              <div className="content">
                <div className="title">
                  <Trans>Update password</Trans>
                </div>
                <form onSubmit={form.handleSubmit}>
                  <InputTextField
                    className="password"
                    type="password"
                    name="newPassword"
                    edit
                    value={form.values.newPassword}
                    onChange={form.handleChange}
                    placeholder={t`New password`}
                    error={shouldShowErrors && form.errors.newPassword}
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
  }
)
NewPassword.displayName = 'SignUpPage'
