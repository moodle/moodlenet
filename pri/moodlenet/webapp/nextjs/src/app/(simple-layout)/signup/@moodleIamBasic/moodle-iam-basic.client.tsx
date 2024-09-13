'use client'
import { lib_moodle_iam } from '@moodle/lib-domain'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { signup, signupResponse } from './moodle-iam-basic.server'
import { useState } from 'react'
import { Trans } from 'react-i18next'

export function SignupIcon() {
  return <PrimaryButton color="blue">Using email</PrimaryButton>
}

export type SignupProps = {
  primaryMsgSchemaConfigs: lib_moodle_iam.v0_1.PrimaryMsgSchemaConfigs
}

export default function SignupPanel({ primaryMsgSchemaConfigs }: SignupProps) {
  const { signupSchema } = lib_moodle_iam.v0_1.getPrimarySchemas(primaryMsgSchemaConfigs)

  const [signupErr, setSignupErr] = useState<signupResponse>()
  const form = useFormik<lib_moodle_iam.v0_1.signupForm>({
    onSubmit: values => signup(values).then(setSignupErr),
    initialValues: { email: '', password: { __redacted__: '' }, displayName: '' },
    validationSchema: toFormikValidationSchema(signupSchema),
  })
  const shouldShowErrors = !!form.submitCount
  const canSubmit = !form.isSubmitting && !form.isValidating
  return (
    <>
      <form action={form.submitForm}>
        <InputTextField
          className="display-name"
          placeholder={`Display name`}
          name="displayName"
          edit
          value={form.values.displayName}
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.displayName}
        />
        <InputTextField
          className="email"
          placeholder={`Email`}
          type="email"
          name="email"
          edit
          value={form.values.email}
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.email}
        />
        <InputTextField
          className="password"
          placeholder={`Password`}
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
