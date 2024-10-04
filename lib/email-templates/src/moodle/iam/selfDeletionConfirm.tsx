import { moodle_core_context } from '@moodle/domain'
import React from 'react'
import * as main from '..'

export type DeleteAccountEmailProps = {
  ctx: Pick<moodle_core_context, 'sys_call'>
  deleteAccountUrl: string
  receiverEmail: string
}

export async function selfDeletionConfirmEmail({
  ctx,
  deleteAccountUrl,
  receiverEmail,
}: DeleteAccountEmailProps) {
  const senderInfo = await main.getSenderInfo(ctx)
  const title = `Confirm account deletion 🥀`

  const body = (
    <div style={contentStyle}>
      The deletion of your {senderInfo.name} account means that:
      <br />
      <ul style={listStyle}>
        <li>
          All your personal information <span style={contentDeleteSpan}>will be removed.</span>
        </li>
        <li>Your contributions will be kept anonymous.</li>
      </ul>
      Before deleting your account, feel free to unpublish or remove any content you don&apos;t want
      to be kept.
    </div>
  )

  return main.layoutEmail({
    senderInfo,
    content: {
      body,
      receiverEmail,
      subject: title,
      title,
      action: {
        title: 'Delete account permanently',
        url: deleteAccountUrl,
        buttonStyle: { background: '#ff0000', color: '#ffffff' },
      },
      hideIgnoreMessage: true,
    },
  })
}

const contentStyle: React.CSSProperties = {
  textAlign: 'left',
}

const listStyle: React.CSSProperties = {
  textAlign: 'left',
  margin: '22px 22px',
  paddingLeft: '30px',
}

const contentDeleteSpan: React.CSSProperties = {
  borderRadius: '5px',
  padding: '3px 7px',
  background: '#ff0000',
  color: '#ffffff',
}