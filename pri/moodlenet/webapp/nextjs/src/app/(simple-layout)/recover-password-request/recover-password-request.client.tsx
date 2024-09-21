'use client'
import { email_address } from '@moodle/lib-types'
import { CallMade as CallMadeIcon } from '@mui/icons-material'
import { useFormik } from 'formik'
import Link from 'next/link'
import { useState } from 'react'
import { Trans, useTranslation } from 'next-i18next'
import { object, string } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { sitepaths } from '../../../lib/common/utils/sitepaths'
import { Card } from '../../../ui/atoms/Card/Card'
import InputTextField from '../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../ui/atoms/PrimaryButton/PrimaryButton'
import { recoverPasswordRequestRequest } from './recover-password-request.server'

export function RecoverPasswordRequestClient() {
  const form = useFormik<{ email: email_address }>({
    initialValues: { email: '' },
    validationSchema: toFormikValidationSchema(object({ email: string().email() })),
    onSubmit: (values, { resetForm }) => {
      resetForm()
      setRequestSent(true)
      return recoverPasswordRequestRequest({ email: values.email })
    },
  })
  const { t } = useTranslation()
  const [requestSent, setRequestSent] = useState(false)
  const shouldShowErrors = !!form.submitCount
  const loginHref = sitepaths().pages.access.login
  return (
    <div className={`recover-password-request-page`}>
      {!requestSent && (
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
              <form onSubmit={form.handleSubmit}>
                <InputTextField
                  className="email"
                  type="email"
                  name="email"
                  edit
                  value={form.values.email}
                  onChange={form.handleChange}
                  placeholder={t(`Email`)}
                  error={shouldShowErrors && form.errors.email}
                  disabled={form.isSubmitting || requestSent}
                />
                <button type="submit" style={{ display: 'none' }} />
              </form>
              <div className="bottom">
                <div className="left">
                  <PrimaryButton
                    disabled={form.isSubmitting || form.isValidating || requestSent}
                    onClick={form.isSubmitting || form.isValidating ? undefined : form.submitForm}
                  >
                    <Trans>Next</Trans>
                  </PrimaryButton>
                </div>
                <div className="right" hidden></div>
              </div>
            </div>
          </Card>
        </div>
      )}
      {requestSent && (
        <div className={`success-content ${requestSent ? 'success' : ''}`}>
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
