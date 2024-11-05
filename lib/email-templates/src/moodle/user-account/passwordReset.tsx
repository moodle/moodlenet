import { url_string } from '@moodle/lib-types'
import React from 'react'
import { EmailLayoutContentProps } from '../email-layout'

export type resetPasswordRequestNotificationEmailProps = {
  siteName: string
  resetPasswordUrl: url_string
}

export function resetPasswordEmail({
  resetPasswordUrl,
  siteName,
}: resetPasswordRequestNotificationEmailProps): EmailLayoutContentProps {
  const title = `Ready to change your password 🔑`
  const body = (
    <React.Fragment>
      Someone (probably you) requested a password change on {siteName}. If that was you, please click on the button below and
      choose a new password for your account.
    </React.Fragment>
  )

  return {
    body,
    subject: title,
    title,
    hideIgnoreMessage: false,
    action: {
      title: 'Change password',
      url: resetPasswordUrl,
    },
  }
}
