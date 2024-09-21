'use client'
import type * as iam_v1_0 from '@moodle/mod-iam/v1_0/types'
import { useFormik } from 'formik'
import { ReactElement, useState } from 'react'
import { Trans, useTranslation } from 'next-i18next'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Card } from '../../../../ui/atoms/Card/Card'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { Snackbar } from '../../../../ui/atoms/Snackbar/Snackbar'
import SnackbarStack from '../../../../ui/atoms/Snackbar/SnackbarStack'
import { changePassword } from './general.server'
import './general.style.scss'
import { getPrimarySchemas } from '@moodle/mod-iam/v1_0/lib'

export interface GeneralSettingsProps {
  primaryMsgSchemaConfigs: iam_v1_0.PrimaryMsgSchemaConfigs
}
export function GeneralSettingsClient({ primaryMsgSchemaConfigs }: GeneralSettingsProps) {
  const { t } = useTranslation()
  const { changePasswordSchema } = getPrimarySchemas(primaryMsgSchemaConfigs)
  const [snackbarList, setSnackbarList] = useState<ReactElement[]>([])

  const form = useFormik<iam_v1_0.changePasswordForm>({
    initialValues: { newPassword: { __redacted__: '' }, currentPassword: { __redacted__: '' } },
    validationSchema: toFormikValidationSchema(changePasswordSchema),
    onSubmit: async (formValues, { resetForm, setErrors, setFormikState }) => {
      if (formValues.newPassword.__redacted__ === formValues.currentPassword.__redacted__) {
        setErrors({ newPassword: { __redacted__: t('New password should be different') } })
        return
      }
      setSnackbarList([])
      return changePassword(formValues).then(([done]) => {
        setSnackbarList(
          done
            ? [
                <Snackbar key={`password-change-success`} type="success">
                  <Trans>Password changed</Trans>
                </Snackbar>,
              ]
            : [
                <Snackbar key={`password-change-error`} type="error">
                  <Trans>
                    Failed to change your password, ensure you entered your current password
                    correctly
                  </Trans>
                </Snackbar>,
              ],
        )
        resetForm()
      })
    },
  })
  const shouldShowErrors = !!form.submitCount

  const snackbars = <SnackbarStack snackbarList={snackbarList}></SnackbarStack>

  const canSubmit = form.dirty && !form.isSubmitting && !form.isValidating
  return (
    <div className="general" key="general">
      {snackbars}
      <Card className="column">
        <div className="title">
          <Trans>General</Trans>
        </div>
      </Card>
      <Card className="column change-password-section">
        <div className="parameter">
          <div className="name">
            <Trans>Change password</Trans>
          </div>
          <div className="actions">
            <InputTextField
              className="password"
              placeholder={t('Enter your current password')}
              value={form.values.currentPassword.__redacted__}
              onChange={form.handleChange}
              type="password"
              name="currentPassword.__redacted__"
              error={shouldShowErrors && form.errors.currentPassword?.__redacted__}
              autoComplete="new-password"
            />
          </div>
          <br />
          <div className="actions">
            <InputTextField
              className="password"
              placeholder={t('Enter your new password')}
              value={form.values.newPassword.__redacted__}
              onChange={form.handleChange}
              type="password"
              name="newPassword.__redacted__"
              error={shouldShowErrors && form.errors.newPassword?.__redacted__}
              autoComplete="new-password"
            />
          </div>
        </div>
        <PrimaryButton onClick={form.submitForm} disabled={!canSubmit} className="save-btn">
          <Trans>Save</Trans>
        </PrimaryButton>
      </Card>
    </div>
  )
}
