'use client'
import { lib_moodle_iam } from '@moodle/lib-domain'
import { useFormik } from 'formik'
import Link from 'next/link'
import { Trans } from 'react-i18next'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { TertiaryButton } from '../../../../ui/atoms/TertiaryButton/TertiaryButton'
import { login, loginResponse } from './login-email-pwd.server'
import { useState } from 'react'
export function LoginIcon() {
  return <PrimaryButton color="blue">Using email</PrimaryButton>
}

export type LoginProps = {
  recoverPasswordUrl: string
  primaryMsgSchemaConfigs: lib_moodle_iam.v1_0.PrimaryMsgSchemaConfigs
}

export default function LoginPanel({ recoverPasswordUrl, primaryMsgSchemaConfigs }: LoginProps) {
  const { loginSchema } = lib_moodle_iam.v1_0.getPrimarySchemas(primaryMsgSchemaConfigs)
  const [loginResponse, setLoginResponse] = useState<loginResponse>()
  const form = useFormik<lib_moodle_iam.v1_0.loginForm>({
    onSubmit: values => login(values).then(setLoginResponse),
    initialValues: { email: '', password: { __redacted__: '' } },
    validationSchema: toFormikValidationSchema(loginSchema),
  })
  const shouldShowErrors = !!form.submitCount
  const canSubmit = !form.isSubmitting && !form.isValidating

  return (
    <>
      <form action={form.submitForm}>
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
        {loginResponse?.loginFailed && (
          <div className="error">
            <Trans>Incorrect email or password</Trans>
          </div>
        )}
        <button type="submit" style={{ display: 'none' }} />
      </form>
      <div className="bottom">
        <div className="content">
          <div className="left">
            <PrimaryButton onClick={canSubmit ? form.submitForm : undefined}>Log in</PrimaryButton>
            <Link href={recoverPasswordUrl}>
              <TertiaryButton>
                <Trans>or recover password</Trans>
              </TertiaryButton>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

/*                <div className="right" hidden>
                    <div className="icon">
                      <img
                        alt="apple login"
                        src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                      />
                    </div>
                    <div className="icon">
                      <img
                        alt="google login"
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                      />
                    </div>
                  </div>
*/
