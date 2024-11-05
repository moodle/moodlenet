'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { Trans, useTranslation } from 'next-i18next'
import { useAllPrimarySchemas } from '../../../../lib/client/globalContexts'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { signupAction } from './signup-email-pwd.server'

export default function SignupPanel() {
  const { t } = useTranslation()
  const { userAccount } = useAllPrimarySchemas()
  const {
    form: { formState, register },
    handleSubmitWithAction,
  } = useHookFormAction(signupAction, zodResolver(userAccount.signupSchema))

  const additionalError = formState.errors.root?.message
  return (
    <>
      <form onSubmit={handleSubmitWithAction}>
        <InputTextField className="display-name" placeholder={t(`Display name`)} edit error={formState.errors.displayName?.message} {...register('displayName')} />
        <InputTextField className="email" placeholder={t(`Email`)} type="email" edit error={formState.errors.email?.message} {...register('email')} />
        <InputTextField
          className="password"
          placeholder={t(`Password`)}
          type="password"
          edit
          error={formState.errors.password?.__redacted__?.message}
          {...register('password.__redacted__')}
        />
        <PrimaryButton disabled={formState.isSubmitting}>
          <Trans>Sign up</Trans>
        </PrimaryButton>
      </form>
      <div className="general-error" hidden={!additionalError}>
        {additionalError}
      </div>
    </>
  )
}
