import React from 'react'
import { EmailLayoutContentProps } from '../email-layout'

export type passwordChangedNotificationEmailProps = {
  siteName: string
}

export function passwordChangedEmail({ siteName }: passwordChangedNotificationEmailProps): EmailLayoutContentProps {
  const title = `Password changed 🔒💫`
  const body = (
    <React.Fragment>
      Your password has been successfully changed in {siteName}. If it was not you, recover your password and keep in safer.
    </React.Fragment>
  )
  return {
    body,
    subject: title,
    title,
    hideIgnoreMessage: false,
  }
}
