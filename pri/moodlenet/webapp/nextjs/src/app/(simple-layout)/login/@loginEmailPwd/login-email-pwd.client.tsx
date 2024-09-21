'use client'
import { getPrimarySchemas } from '@moodle/mod-iam/v1_0/lib'
import { PrimaryMsgSchemaConfigs } from '@moodle/mod-iam/v1_0/types'
import Link from 'next/link'
import { Trans, useTranslation } from 'next-i18next'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { TertiaryButton } from '../../../../ui/atoms/TertiaryButton/TertiaryButton'
import { loginAction } from './login-email-pwd.server'
import { sitepaths } from '../../../../lib/common/utils/sitepaths'
import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'

export type LoginProps = { primaryMsgSchemaConfigs: PrimaryMsgSchemaConfigs }

export default function LoginPanel({ primaryMsgSchemaConfigs }: LoginProps) {
  const { t } = useTranslation()
  const { loginSchema } = getPrimarySchemas(primaryMsgSchemaConfigs)
  const {
    form: { formState, register },
    handleSubmitWithAction,
  } = useHookFormAction(loginAction, zodResolver(loginSchema))
  const recoverPasswordHref = sitepaths().pages.access.recoverPasswordRequest('')

  const loginErrorMsg = formState.errors.root?.message
  return (
    <>
      <form>
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
        <button type="submit" style={{ display: 'none' }} />
      </form>
      <div className="bottom">
        <div className="content">
          <div className="left">
            <PrimaryButton disabled={!formState.isValid} onClick={handleSubmitWithAction}>
              Log in
            </PrimaryButton>
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
