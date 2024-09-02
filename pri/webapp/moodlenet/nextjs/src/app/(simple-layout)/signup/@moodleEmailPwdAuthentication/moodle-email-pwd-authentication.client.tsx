'use client'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { signup } from './moodle-email-pwd-authentication.server'

import { getSignupFormSchema, signupFormConfigs, signupFormValues } from '@moodle/mod/eml-pwd-auth'

export function SignupIcon() {
  return <PrimaryButton color="blue">Using email</PrimaryButton>
}

export type SignupProps = {
  configs: signupFormConfigs
}

export default function SignupPanel({ configs }: SignupProps) {
  const zod = getSignupFormSchema(configs)
  const form = useFormik<signupFormValues>({
    onSubmit: values => signup(values),
    initialValues: { email: '', password: '', displayName: '' },
    validationSchema: toFormikValidationSchema(zod),
  })
  const shouldShowErrors = !!form.submitCount
  const canSubmit = !form.isSubmitting && !form.isValidating
  const errMsg = ''
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
          name="password"
          edit
          value={form.values.password}
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.password}
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
      <div className="general-error" hidden={!errMsg}>
        {errMsg}
      </div>
    </>
  )
}
