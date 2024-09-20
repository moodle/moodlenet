'use client'
import { useFormik } from 'formik'
import { Trans, useTranslation } from 'react-i18next'
import { Card } from '../../../../ui/atoms/Card/Card'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../ui/atoms/PrimaryButton/PrimaryButton'

export function ResetPasswordClient() {
  const form = useFormik<{ newPassword: string }>({
    initialValues: { newPassword: '' },
    // validationSchema: ,
    onSubmit: (values, { resetForm }) => {
      resetForm()
    },
  })
  const { t } = useTranslation()
  const shouldShowErrors = !!form.submitCount

  return (
    <div className="new-password-page">
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
                placeholder={t(`New password`)}
                error={shouldShowErrors && form.errors.newPassword}
              />
            </form>
            <div className="bottom">
              <div className="left">
                <PrimaryButton
                  onClick={form.isSubmitting || form.isValidating ? undefined : form.submitForm}
                >
                  <Trans>Change password</Trans>
                </PrimaryButton>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
