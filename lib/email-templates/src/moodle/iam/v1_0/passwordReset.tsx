import React from 'react'
import * as email_org_v1_0 from '../../org/v1_0'

export type ResetPasswordContentEmailProps = {
  receiverEmail: string
  resetPasswordUrl: string
}

export function resetPasswordContent({
  resetPasswordUrl,
  receiverEmail,
}: ResetPasswordContentEmailProps): email_org_v1_0.EmailLayoutContentProps {
  const title = `Ready to change your password 🔑`
  const body = (
    <React.Fragment>
      Someone (probably you) requested a password change on MoodleNet. If that was you, please click
      on the button below and choose a new password for your account.
    </React.Fragment>
  )

  return {
    body,
    receiverEmail,
    subject: title,
    title,
    hideIgnoreMessage: false,
    action: {
      title: 'Change password',
      url: resetPasswordUrl,
    },
  }
}
