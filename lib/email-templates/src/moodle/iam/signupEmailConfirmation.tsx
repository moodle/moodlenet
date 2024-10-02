import { moodle_core_context } from '@moodle/domain'
import React from 'react'
import * as main from '..'

export type SignupEmailConfirmationProps = {
  ctx: Pick<moodle_core_context, 'sys_call'>
  activateAccountUrl: string
  receiverEmail: string
}

export async function signupEmailConfirmationEmail({
  ctx,
  receiverEmail,
  activateAccountUrl,
}: SignupEmailConfirmationProps) {
  const senderInfo = await main.getSenderInfo(ctx)
  const title = `Welcome to ${senderInfo.name} 🎉`

  const body = (
    <React.Fragment>
      Thanks for signing up to {senderInfo.name}!<br />
      <br />
      Click the button below to activate your account.
    </React.Fragment>
  )

  return main.layoutEmail({
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
