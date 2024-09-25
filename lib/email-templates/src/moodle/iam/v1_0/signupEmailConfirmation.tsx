import { CoreContext } from '@moodle/lib-ddd'
import React from 'react'
import * as email_org_v1_0 from '../../org/v1_0'

export type SignupEmailConfirmationProps = {
  ctx: Pick<CoreContext, 'sysCall'>
  activateAccountUrl: string
  receiverEmail: string
}

export async function signupEmailConfirmationEmail({
  ctx,
  receiverEmail,
  activateAccountUrl,
}: SignupEmailConfirmationProps) {
  const senderInfo = await email_org_v1_0.getSenderInfo(ctx)
  const title = `Welcome to ${senderInfo.name} 🎉`

  const body = (
    <React.Fragment>
      Thanks for signing up to {senderInfo.name}!<br />
      <br />
      Click the button below to activate your account.
    </React.Fragment>
  )

  return email_org_v1_0.layoutEmail({
    senderInfo: senderInfo,
    content: {
      body,
      receiverEmail,
      subject: title,
      title,
      hideIgnoreMessage: false,
      action: { title: 'Activate account', url: activateAccountUrl },
    },
  })
}
