'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { Trans, useTranslation } from 'next-i18next'
import Link from 'next/link'
import { sitepaths } from '../../../../lib/common/utils/sitepaths'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { TertiaryButton } from '../../../../ui/atoms/TertiaryButton/TertiaryButton'
import { loginAction } from './login-email-pwd.server'
import { useAllPrimarySchemas } from '../../../../lib/client/globalContexts'

export default function LoginPanel() {
  const { t } = useTranslation()
  const { userAccount } = useAllPrimarySchemas()
  const {
    form: { formState, register },
    handleSubmitWithAction,
  } = useHookFormAction(loginAction, zodResolver(userAccount.loginSchema))
  const recoverPasswordHref = sitepaths['recover-password-request']()

  const loginErrorMsg = formState.errors.root?.message
  return (
    <>
      <form onSubmit={handleSubmitWithAction}>
        <InputTextField
          className="email"
          placeholder={t(`Email`)}
          type="email"
          edit
          error={formState.errors.email?.message}
          {...register('email')}
        />
        <InputTextField
          className="password"
          placeholder={t(`Password`)}
          type="password"
          edit
          error={formState.errors.password?.__redacted__?.message}
          {...register('password.__redacted__')}
        />
        {loginErrorMsg && <div className="error">{loginErrorMsg}</div>}
        <PrimaryButton disabled={formState.isSubmitting} type="submit">
          Log in
        </PrimaryButton>
      </form>
      <div className="bottom">
        <div className="content">
          <div className="left">
            <Link href={recoverPasswordHref}>
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
