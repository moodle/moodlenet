import React from 'react'
import * as email_org from '../../org'
import { CoreContext } from '@moodle/lib-ddd'

export type PasswordChangedEmailProps = {
  ctx: Pick<CoreContext, 'sys_call'>
  receiverEmail: string
}

export async function passwordChangedEmail({ receiverEmail, ctx }: PasswordChangedEmailProps) {
  const senderInfo = await email_org.getSenderInfo(ctx)
  const title = `Password changed 🔒💫`
  const body = (
    <React.Fragment>
      Your password has been successfully changed. If it was not you, recover your password and keep
      in safer.
    </React.Fragment>
  )
  return email_org.layoutEmail({
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
