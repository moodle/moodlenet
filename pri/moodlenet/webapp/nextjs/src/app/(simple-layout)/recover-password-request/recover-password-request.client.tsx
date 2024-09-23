'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CallMade as CallMadeIcon } from '@mui/icons-material'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { Trans, useTranslation } from 'next-i18next'
import Link from 'next/link'
import { sitepaths } from '../../../lib/common/utils/sitepaths'
import { Card } from '../../../ui/atoms/Card/Card'
import InputTextField from '../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../ui/atoms/PrimaryButton/PrimaryButton'
import { recoverPasswordRequestSchema } from './recover-password-request.common'
import { recoverPasswordRequestAction } from './recover-password-request.server'

export function RecoverPasswordRequestClient() {
  const {
    form: { formState, register },
    handleSubmitWithAction,
  } = useHookFormAction(recoverPasswordRequestAction, zodResolver(recoverPasswordRequestSchema), {
    formProps: {},
  })
  const { t } = useTranslation()

  const loginHref = sitepaths().pages.access.login()

  const requestSent = formState.isSubmitSuccessful
  return (
    <div className={`recover-password-request-page`}>
      {!requestSent ? (
        <div className={`recover-password-request-content`}>
          <Card className="login-card" hover={true}>
            <Link href={loginHref}>
              <Trans>Log in</Trans>
              <CallMadeIcon />
            </Link>
          </Card>
          <Card className="recover-password-request-card">
            <div className="content">
              <div className="title">
                <Trans>Recover password</Trans>
              </div>
              <form onSubmit={handleSubmitWithAction}>
                <InputTextField
                  className="email"
                  type="email"
                  edit
                  placeholder={t(`Email`)}
                  error={formState.errors.email?.message}
                  {...register('email')}
                />
                <br />
                <PrimaryButton type="submit" disabled={formState.isSubmitting}>
                  <Trans>Next</Trans>
                </PrimaryButton>
              </form>
            </div>
          </Card>
        </div>
      ) : (
        <div className={`success-content success`}>
          <Card>
            <div className="content">
              <div className="emoji">📨</div>
              {/* <MailOutline className="icon" /> */}
              <div className="subtitle">
                <Trans>
                  If the email you provided corresponds to a MoodleNet user, you&apos;ll receive an
                  email with a change password link
                </Trans>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
