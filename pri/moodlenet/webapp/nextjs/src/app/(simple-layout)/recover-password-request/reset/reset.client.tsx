'use client'
import { Trans, useTranslation } from 'next-i18next'
import { Card } from '../../../../ui/atoms/Card/Card'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { PrimaryMsgSchemaConfigs } from '@moodle/mod-iam/v1_0/types'
import { getPrimarySchemas } from '@moodle/mod-iam/v1_0/lib'
import { resetMyPasswordAction } from './reset.server'
import { sitepaths } from '../../../../lib/common/utils/sitepaths'
import Link from 'next/link'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { zodResolver } from '@hookform/resolvers/zod'

export function ResetPasswordClient({
  resetPasswordToken,
  primaryMsgSchemaConfigs,
}: {
  primaryMsgSchemaConfigs: PrimaryMsgSchemaConfigs
  resetPasswordToken: string
}) {
  const { t } = useTranslation()
  const { resetPasswordSchema } = getPrimarySchemas(primaryMsgSchemaConfigs)

  const {
    form: { formState, register },
    action,
    handleSubmitWithAction,
  } = useHookFormAction(resetMyPasswordAction, zodResolver(resetPasswordSchema), {
    formProps: {
      values: {
        newPassword: { __redacted__: '' },
        token: resetPasswordToken,
      },
    },
  })

  const loginHref = sitepaths().pages.access.login

  const actionError = formState.errors.root?.message

  return (
    <div className="new-password-page">
      <div className="main-content">
        <Card>
          {action.status === 'idle' ? (
            <div className="content">
              <div className="title">
                <Trans>Update password</Trans>
              </div>
              <form>
                <InputTextField
                  className="password"
                  placeholder={t(`New password`)}
                  type="password"
                  edit
                  error={formState.errors.newPassword?.__redacted__?.message}
                  {...register('newPassword.__redacted__')}
                />
              </form>
              <div className="bottom">
                <div className="left">
                  <PrimaryButton disabled={!formState.isValid} onClick={handleSubmitWithAction}>
                    <Trans>Change password</Trans>
                  </PrimaryButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="content">
              {/* <MailOutline className="icon" /> */}
              <div className="subtitle">
                {actionError || (
                  <Link href={loginHref}>
                    <Trans>
                      Your password has been successfully changed. You can now login with your new
                      password.
                    </Trans>
                  </Link>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
