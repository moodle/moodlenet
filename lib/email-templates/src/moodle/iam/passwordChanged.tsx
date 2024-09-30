import { moodle_core_context } from '@moodle/domain'
import React from 'react'
import * as main from '..'

export type PasswordChangedEmailProps = {
  ctx: Pick<moodle_core_context, 'sys_call'>
  receiverEmail: string
}

export async function passwordChangedEmail({ receiverEmail, ctx }: PasswordChangedEmailProps) {
  const senderInfo = await main.getSenderInfo(ctx)
  const title = `Password changed 🔒💫`
  const body = (
    <React.Fragment>
      Your password has been successfully changed. If it was not you, recover your password and keep
      in safer.
    </React.Fragment>
  )
  return main.layoutEmail({
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
