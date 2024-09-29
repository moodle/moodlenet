import React from 'react'
import * as email_org from '../../org'
import { CoreContext } from '@moodle/lib-ddd'

export type ResetPasswordContentEmailProps = {
  receiverEmail: string
  resetPasswordUrl: string
  ctx: Pick<CoreContext, 'sys_call'>
}

export async function resetPasswordEmail({
  resetPasswordUrl,
  receiverEmail,
  ctx,
}: ResetPasswordContentEmailProps) {
  const senderInfo = await email_org.getSenderInfo(ctx)
  const title = `Ready to change your password 🔑`
  const body = (
    <React.Fragment>
      Someone (probably you) requested a password change on MoodleNet. If that was you, please click
      on the button below and choose a new password for your account.
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
      action: {
        title: 'Change password',
        url: resetPasswordUrl,
      },
    },
  })
}
