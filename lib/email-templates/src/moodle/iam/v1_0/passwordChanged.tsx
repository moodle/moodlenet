import React from 'react'
import * as email_org_v1_0 from '../../org/v1_0'
import { CoreContext } from '@moodle/lib-ddd'

export type PasswordChangedEmailProps = {
  ctx: Pick<CoreContext, 'sysCall'>
  receiverEmail: string
}

export async function passwordChangedEmail({ receiverEmail, ctx }: PasswordChangedEmailProps) {
  const senderInfo = await email_org_v1_0.getSenderInfo(ctx)
  const title = `Password changed 🔒💫`
  const body = (
    <React.Fragment>
      Your password has been successfully changed. If it was not you, recover your password and keep
      in safer.
    </React.Fragment>
  )
  return email_org_v1_0.layoutEmail({
    senderInfo,
    content: {
      body,
      receiverEmail,
      subject: title,
      title,
      hideIgnoreMessage: false,
    },
  })
}
