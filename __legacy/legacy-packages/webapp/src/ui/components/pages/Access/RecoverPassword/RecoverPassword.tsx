import { t, Trans } from '@lingui/macro'
import CallMadeIcon from '@material-ui/icons/CallMade'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import React from 'react'
import { Href, Link } from '../../../../elements/link'
import { CP, withCtrl } from '../../../../lib/ctrl'
import { FormikHandle } from '../../../../lib/formik'
import Card from '../../../atoms/Card/Card'
import { InputTextField } from '../../../atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import {
  MainPageWrapper,
  MainPageWrapperProps,
} from '../../../templates/MainPageWrapper'
import AccessHeader, { AccessHeaderProps } from '../AccessHeader/AccessHeader'
import './styles.scss'

export type RecoverPasswordFormValues = { email: string }
export type RecoverPasswordProps = {
  mainPageWrapperProps: CP<MainPageWrapperProps>
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
  form: FormikHandle<RecoverPasswordFormValues>
  RecoverPasswordErrorMessage: string | null
  requestSent: boolean
  loginHref: Href
  landingHref: Href
}

export const RecoverPassword = withCtrl<RecoverPasswordProps>(
  ({
    mainPageWrapperProps,
    accessHeaderProps,
    form,
    requestSent,
    loginHref,
    RecoverPasswordErrorMessage,
  }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        form.submitForm()
      }
    }

    const shouldShowErrors =
      !!form.submitCount && (RecoverPasswordErrorMessage || !form.isValid)

    return (
      <MainPageWrapper
        {...mainPageWrapperProps}
        onKeyDown={handleKeyDown}
        style={{ background: '#f4f5f7' }}
      >
        <div
          className={`recover-password-page ${requestSent ? 'success' : ''}`}
        >
          <AccessHeader {...accessHeaderProps} page={'login'} />
          <div
            className={`recover-password-content ${
              requestSent ? 'success' : ''
            }`}
          >
            <Card hover={true}>
              <Link href={loginHref}>
                <Trans>Log in</Trans>
                <CallMadeIcon />
              </Link>
            </Card>
            <Card>
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
                    placeholder={t`Email`}
                    error={shouldShowErrors && form.errors.email}
                  />
                  <button type="submit" style={{ display: 'none' }} />
                </form>
                <div className="bottom">
                  <div className="left">
                    <PrimaryButton
                      onClick={
                        form.isSubmitting || form.isValidating
                          ? undefined
                          : form.submitForm
                      }
                    >
                      <Trans>Next</Trans>
                    </PrimaryButton>
                  </div>
                  <div className="right" hidden>
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
                </div>
              </div>
            </Card>
          </div>
          <div className={`success-content ${requestSent ? 'success' : ''}`}>
            <Card>
              <div className="content">
                <MailOutlineIcon className="icon" />
                <div className="subtitle">
                  <Trans>
                    If the email you provided corresponds to a MoodleNet user,
                    you'll receive an email with a change password link
                  </Trans>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </MainPageWrapper>
    )
  }
)
