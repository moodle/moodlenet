import { Card, InputTextField, PrimaryButton } from '@moodlenet/component-library'
import type { MainFooterProps, MinimalisticHeaderProps } from '@moodlenet/react-app/ui'
import { SimpleLayout } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import type { ComponentType, FC } from 'react'
import { newPasswordValidationSchema } from '../../../common/types.mjs'
import './NewPassword.scss'

export type NewPasswordFormValues = { name: string; email: string; password: string }
export type NewPasswordItem = { Icon: ComponentType; Panel: ComponentType; key: string }
export type NewPasswordProps = {
  headerProps: MinimalisticHeaderProps
  footerProps: MainFooterProps
  changePassword: (newPassowrd: string) => void
}

export const NewPassword: FC<NewPasswordProps> = ({ headerProps, footerProps, changePassword }) => {
  const form = useFormik<{ newPassword: string }>({
    initialValues: { newPassword: '' },
    validationSchema: newPasswordValidationSchema,
    onSubmit: (values, { resetForm }) => {
      resetForm()
      changePassword(values.newPassword)
    },
  })

  const shouldShowErrors = !!form.submitCount

  return (
    <SimpleLayout
      footerProps={footerProps}
      headerProps={headerProps}
      style={{ height: '100%' }}
      contentStyle={{ padding: '0' }}
    >
      <div className="new-password-page">
        <div className="main-content">
          <Card>
            <div className="content">
              <div className="title">Update password</div>
              <form onSubmit={form.handleSubmit}>
                <InputTextField
                  className="password"
                  type="password"
                  name="newPassword"
                  edit
                  value={form.values.newPassword}
                  onChange={form.handleChange}
                  placeholder={`New password`}
                  error={shouldShowErrors && form.errors.newPassword}
                />
              </form>
              <div className="bottom">
                <div className="left">
                  <PrimaryButton
                    onClick={form.isSubmitting || form.isValidating ? undefined : form.submitForm}
                  >
                    Change password
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SimpleLayout>
  )
}
