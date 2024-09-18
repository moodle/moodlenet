'use client'
import { lib_moodle_iam } from '@moodle/lib-domain'
import { useFormik } from 'formik'
import { ReactElement, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Card } from '../../../../ui/atoms/Card/Card'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { Snackbar } from '../../../../ui/atoms/Snackbar/Snackbar'
import SnackbarStack from '../../../../ui/atoms/Snackbar/SnackbarStack'
import { changePassword } from './general.server'
import './general.style.scss'

export function GeneralMenu() {
  return (
    <abbr title="General">
      <Trans>General</Trans>
    </abbr>
  )
}
export interface GeneralSettingsProps {
  primaryMsgSchemaConfigs: lib_moodle_iam.v1_0.PrimaryMsgSchemaConfigs
}
export function GeneralSettingsClient({ primaryMsgSchemaConfigs }: GeneralSettingsProps) {
  const { t } = useTranslation()
  const { changePasswordSchema } = lib_moodle_iam.v1_0.getPrimarySchemas(primaryMsgSchemaConfigs)
  const [snackbarList, setSnackbarList] = useState<ReactElement[]>([])

  const form = useFormik<lib_moodle_iam.v1_0.changePasswordForm>({
    initialValues: { newPassword: { __redacted__: '' }, currentPassword: { __redacted__: '' } },
    validationSchema: toFormikValidationSchema(changePasswordSchema),
    onSubmit: (formValues, { resetForm }) => {
      setSnackbarList([])
      return changePassword(formValues).then(([done, result]) => {
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
                    Password not changed, ensure you correctly entered your current password
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

  const canSubmit =
    form.dirty &&
    form.isValid &&
    !form.isSubmitting &&
    !form.isValidating &&
    form.values.currentPassword.__redacted__ !== form.values.newPassword.__redacted__

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
              defaultValue=""
              value={form.values.currentPassword.__redacted__}
              onChange={form.handleChange}
              type="password"
              name="currentPassword.__redacted__"
              key="currentPassword"
              error={shouldShowErrors && form.errors.currentPassword?.__redacted__}
              autoComplete="new-password"
            />
          </div>
          <div className="actions">
            <InputTextField
              className="password"
              placeholder={t('Enter your new password')}
              defaultValue=""
              value={form.values.newPassword.__redacted__}
              onChange={form.handleChange}
              type="password"
              name="newPassword.__redacted__"
              key="newPassword"
              error={shouldShowErrors && form.errors.newPassword?.__redacted__}
              autoComplete="new-password"
            />
          </div>
        </div>
        <PrimaryButton onClick={() => form.submitForm()} disabled={!canSubmit} className="save-btn">
          <Trans>Save</Trans>
        </PrimaryButton>
      </Card>
    </div>
  )
}
