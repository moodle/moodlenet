import { contextModuleAccess } from '@moodle/domain'
import React from 'react'
import * as main from '..'

export type PasswordChangedEmailProps = {
  modAccess: contextModuleAccess
  receiverEmail: string
}

export async function passwordChangedEmail({
  receiverEmail,
  modAccess,
}: PasswordChangedEmailProps) {
  const senderInfo = await main.getSenderInfo({ modAccess })
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
