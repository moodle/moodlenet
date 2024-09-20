'use client'
import { getPrimarySchemas } from '@moodle/mod-iam/v1_0/lib'
import { PrimaryMsgSchemaConfigs, signupForm } from '@moodle/mod-iam/v1_0/types'
import { useFormik } from 'formik'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { signup, signupResponse } from './signup-email-pwd.server'

export function SignupIcon() {
  return <PrimaryButton color="blue">Using email</PrimaryButton>
}

export type SignupProps = {
  primaryMsgSchemaConfigs: PrimaryMsgSchemaConfigs
}

export default function SignupPanel({ primaryMsgSchemaConfigs }: SignupProps) {
  const { signupSchema } = getPrimarySchemas(primaryMsgSchemaConfigs)

  const [signupErr, setSignupErr] = useState<signupResponse>()
  const form = useFormik<signupForm>({
    onSubmit: values => signup(values).then(setSignupErr),
    initialValues: { email: '', password: { __redacted__: '' }, displayName: '' },
    validationSchema: toFormikValidationSchema(signupSchema),
  })
  const shouldShowErrors = !!form.submitCount
  const canSubmit = !form.isSubmitting && !form.isValidating
  const { t } = useTranslation()

  return (
    <>
      <form action={form.submitForm}>
        <InputTextField
          className="display-name"
          placeholder={t(`Display name`)}
          name="displayName"
          edit
          value={form.values.displayName}
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.displayName}
        />
        <InputTextField
          className="email"
          placeholder={t(`Email`)}
          type="email"
          name="email"
          edit
          value={form.values.email}
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.email}
        />
        <InputTextField
          className="password"
          placeholder={t(`Password`)}
          type="password"
          name="password.__redacted__"
          edit
          value={form.values.password.__redacted__}
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.password?.__redacted__}
        />
        <button id="signup-button" type="submit" style={{ display: 'none' }} />
      </form>
      <div className="bottom">
        <PrimaryButton
          onClick={
            canSubmit ? () => form.handleSubmit() : undefined
          } /* onClick={canSubmit ? form.submitForm : undefined} */
        >
          Sign up
        </PrimaryButton>
      </div>
      <div className="general-error" hidden={!signupErr}>
        {signupErr?.reason === 'userWithSameEmailExists' ? (
          <Trans>User with this email already exists</Trans>
        ) : (
          <Trans>Signup failed for unknown reasons</Trans>
        )}
      </div>
    </>
  )
}
