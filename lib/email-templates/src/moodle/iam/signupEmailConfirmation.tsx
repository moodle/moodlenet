import React from 'react'
import { EmailLayoutContentProps } from '../email-layout'
export type signupWithEmailConfirmationNotificationProps = {
  siteName: string
  userName: string
  activateAccountUrl: string
}

export function signupEmailConfirmationEmail({
  userName,
  activateAccountUrl,
  siteName,
}: signupWithEmailConfirmationNotificationProps): EmailLayoutContentProps {
  const title = `Welcome to ${siteName} 🎉`

  const body = (
    <React.Fragment>
      Thank you {userName} for signing up to {siteName}!<br />
      <br />
      Click the button below to activate your account.
    </React.Fragment>
  )

  return {
    body,
    subject: title,
    title,
    hideIgnoreMessage: false,
    action: { title: 'Activate account', url: activateAccountUrl },
  }
}
