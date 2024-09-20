'use client'
import { Card, InputTextField, PrimaryButton } from '@moodlenet/component-library'
import type { MainFooterProps, MinimalisticHeaderProps } from '@moodlenet/react-app/ui'
import { SimpleLayout } from '@moodlenet/react-app/ui'
import { CallMade as CallMadeIcon } from '@mui/icons-material'
import { useFormik } from 'formik'
import type { ComponentType, FC } from 'react'
import { Link } from 'react-router-dom'
import { recoverPasswordValidationSchema } from '../../../../../../../zz__legacy/packages/simple-email-auth/src/common/validations.mjs'
import './RecoverPassword.scss'

export type RecoverPasswordFormValues = { name: string; email: string; password: string }
export type RecoverPasswordItem = { Icon: ComponentType; Panel: ComponentType; key: string }
export type RecoverPasswordProps = {
  headerProps: MinimalisticHeaderProps
  footerProps: MainFooterProps
  requestSent: boolean
  requestPasswordChange: (email: string) => void
}

export const RecoverPassword: FC<RecoverPasswordProps> = ({
  headerProps,
  footerProps,
  requestSent,
  requestPasswordChange,
}) => {
  const form = useFormik<{ email: string }>({
    initialValues: { email: '' },
    validationSchema: recoverPasswordValidationSchema,
    onSubmit: (values, { resetForm }) => {
      resetForm()
      requestPasswordChange(values.email)
    },
  })

  const shouldShowErrors = !!form.submitCount

  return (
    <SimpleLayout
      footerProps={footerProps}
      headerProps={headerProps}
      style={{ height: '100%' }}
      contentStyle={{ padding: '0' }}
    >
      <div className={`recover-password-page`}>
        {!requestSent && (
          <div className={`recover-password-content`}>
            <Card className="login-card" hover={true}>
              <Link to={`/login`}>
                Log in
                <CallMadeIcon />
              </Link>
            </Card>
            <Card className="recover-password-card">
              <div className="content">
                <div className="title">Recover password</div>
                <form onSubmit={form.handleSubmit}>
                  <InputTextField
                    className="email"
                    type="email"
                    name="email"
                    edit
                    value={form.values.email}
                    onChange={form.handleChange}
                    placeholder={`Email`}
                    error={shouldShowErrors && form.errors.email}
                  />
                  <button type="submit" style={{ display: 'none' }} />
                </form>
                <div className="bottom">
                  <div className="left">
                    <PrimaryButton
                      onClick={form.isSubmitting || form.isValidating ? undefined : form.submitForm}
                    >
                      Next
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
                  If the email you provided corresponds to a MoodleNet user, you&apos;ll receive an
                  email with a change password link
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </SimpleLayout>
  )
}
