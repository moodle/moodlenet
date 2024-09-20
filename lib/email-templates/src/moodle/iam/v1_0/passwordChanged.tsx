import React from 'react'
import * as email_org_v1_0 from '../../org/v1_0'

export type PasswordChangedEmailProps = {
  receiverEmail: string
}

export function passwordChangedContent({
  receiverEmail,
}: PasswordChangedEmailProps): email_org_v1_0.EmailLayoutContentProps {
  const title = `Password changed 🔒💫`
  const body = (
    <React.Fragment>
      Your password has been successfully changed. If it was not you, recover your password and keep
      in safer.
    </React.Fragment>
  )
  return {
    body,
    receiverEmail,
    subject: title,
    title,
    hideIgnoreMessage: false,
  }
}
