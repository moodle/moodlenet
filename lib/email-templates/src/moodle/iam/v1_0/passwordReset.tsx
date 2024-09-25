import React from 'react'
import * as email_org_v1_0 from '../../org/v1_0'
import { CoreContext } from '@moodle/lib-ddd'

export type ResetPasswordContentEmailProps = {
  receiverEmail: string
  resetPasswordUrl: string
  ctx: Pick<CoreContext, 'worker'>
}

export async function resetPasswordEmail({
  resetPasswordUrl,
  receiverEmail,
  ctx,
}: ResetPasswordContentEmailProps) {
  const senderInfo = await email_org_v1_0.getSenderInfo(ctx)
  const title = `Ready to change your password 🔑`
  const body = (
    <React.Fragment>
      Someone (probably you) requested a password change on MoodleNet. If that was you, please click
      on the button below and choose a new password for your account.
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
      action: {
        title: 'Change password',
        url: resetPasswordUrl,
      },
    },
  })
}
