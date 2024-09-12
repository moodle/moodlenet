import { lib_moodle_org } from '@moodle/lib-domain'
import { v0_1 as email_org_0_1 } from '../../org'
import React from 'react'

export type SignupEmailConfirmationProps = {
  orgInfo: lib_moodle_org.v0_1.OrgInfo
  activateAccountUrl: string
  receiverEmail: string
}

export function signupEmailConfirmationContent({
  orgInfo,
  receiverEmail,
  activateAccountUrl,
}: SignupEmailConfirmationProps): email_org_0_1.EmailLayoutContentProps {
  const title = `Welcome to ${orgInfo.name} 🎉`

  const body = (
    <>
      Thanks for signing up to {orgInfo.name}!<br />
      <br />
      Click the button below to activate your account.
    </>
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
