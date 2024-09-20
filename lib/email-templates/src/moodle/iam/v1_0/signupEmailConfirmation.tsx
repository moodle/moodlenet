import type * as org_v1_0 from '@moodle/mod-org/v1_0/lib'
import React from 'react'
import * as email_org_v1_0 from '../../org/v1_0'

export type SignupEmailConfirmationProps = {
  orgInfo: org_v1_0.OrgInfo
  activateAccountUrl: string
  receiverEmail: string
}

export function signupEmailConfirmationContent({
  orgInfo,
  receiverEmail,
  activateAccountUrl,
}: SignupEmailConfirmationProps): email_org_v1_0.EmailLayoutContentProps {
  const title = `Welcome to ${orgInfo.name} 🎉`

  const body = (
    <React.Fragment>
      Thanks for signing up to {orgInfo.name}!<br />
      <br />
      Click the button below to activate your account.
    </React.Fragment>
  )

  return {
    body,
    receiverEmail,
    subject: title,
    title,
    hideIgnoreMessage: false,
    action: { title: 'Activate account', url: activateAccountUrl },
  }
}
