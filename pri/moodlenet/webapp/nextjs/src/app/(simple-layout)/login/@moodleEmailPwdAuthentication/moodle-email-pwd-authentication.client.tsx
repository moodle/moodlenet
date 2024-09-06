'use client'
import { getSchemas, loginFormValues, ValidationConfigs } from '@moodle/mod-iam'
import { useFormik } from 'formik'
import Link from 'next/link'
import { Trans } from 'react-i18next'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import TertiaryButton from '../../../../ui/atoms/TertiaryButton/TertiaryButton'
import { login } from './moodle-email-pwd-authentication.server'
export function LoginIcon() {
  return <PrimaryButton color="blue">Using email</PrimaryButton>
}

export type LoginProps = {
  recoverPasswordUrl: string
  wrongCreds: boolean
  configs: ValidationConfigs
}

export default function LoginPanel({ wrongCreds, recoverPasswordUrl, configs }: LoginProps) {
  const { loginSchema } = getSchemas(configs)

  const form = useFormik<loginFormValues>({
    onSubmit: values => login(values),
    initialValues: { email: '', password: '' },
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
          name="password"
          edit
          value={form.values.password}
          onChange={form.handleChange}
          error={shouldShowErrors && form.errors.password}
        />
        {wrongCreds && (
          <div className="error">
            <Trans>Incorrect username or password</Trans>
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
