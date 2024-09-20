'use client'
import { useFormik } from 'formik'
import { Trans, useTranslation } from 'react-i18next'
import { Card } from '../../../../ui/atoms/Card/Card'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { PrimaryMsgSchemaConfigs, resetPasswordForm } from '@moodle/mod-iam/v1_0/types'
import { getPrimarySchemas } from '@moodle/mod-iam/v1_0/lib'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { resetMyPassword } from './reset.server'
import { useState } from 'react'
import { sitepaths } from '../../../../lib/common/utils/sitepaths'
import Link from 'next/link'

const no_response_yet = Symbol()
export function ResetPasswordClient({
  resetPasswordToken,
  primaryMsgSchemaConfigs,
}: {
  primaryMsgSchemaConfigs: PrimaryMsgSchemaConfigs
  resetPasswordToken: string
}) {
  const { resetPasswordSchema } = getPrimarySchemas(primaryMsgSchemaConfigs)
  const [resetApiResp, setResetApiResp] = useState<
    typeof no_response_yet | Awaited<ReturnType<typeof resetMyPassword>>[1]
  >(no_response_yet)
  const form = useFormik<resetPasswordForm>({
    initialValues: { newPassword: { __redacted__: '' } },
    validationSchema: toFormikValidationSchema(resetPasswordSchema),
    onSubmit: async (resetPasswordForm, { resetForm }) => {
      const [, response] = await resetMyPassword({ resetPasswordForm, resetPasswordToken })
      setResetApiResp(response)
      resetForm()
    },
  })
  const { t } = useTranslation()
  const shouldShowErrors = !!form.submitCount
  const loginHref = sitepaths().pages.access.login
  const formCard = (
    <Card>
      <div className="content">
        <div className="title">
          <Trans>Update password</Trans>
        </div>
        <form onSubmit={form.handleSubmit}>
          <InputTextField
            className="password"
            type="password"
            name="newPassword.__redacted__"
            edit
            value={form.values.newPassword.__redacted__}
            onChange={form.handleChange}
            placeholder={t(`New password`)}
            error={shouldShowErrors && form.errors.newPassword?.__redacted__}
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
  )

  const responseType =
    resetApiResp === no_response_yet ? null : !resetApiResp ? 'success' : resetApiResp.reason

  const responseCard = (
    <Card>
      <div className="content">
        {/* <MailOutline className="icon" /> */}
        <div className="subtitle">
          {responseType === 'success' ? (
            <Link href={loginHref}>
              <Trans>
                Your password has been successfully changed. You can now login with your new
                password.
              </Trans>
            </Link>
          ) : (
            <Trans>The password reset link is invalid. Please request a new one.</Trans>
          )}
        </div>
      </div>
    </Card>
  )
  return (
    <div className="new-password-page">
      <div className="main-content">{responseType ? responseCard : formCard}</div>
    </div>
  )
}
