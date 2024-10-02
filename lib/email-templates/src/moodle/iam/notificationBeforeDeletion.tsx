import { moodle_core_context } from '@moodle/domain'
import React from 'react'
import * as main from '../'

export type InactivityDeletionNotificationEmailProps = {
  ctx: Pick<moodle_core_context, 'sys_call'>
  loginUrl: string
  receiverEmail: string
  userName: string
  daysBeforeDeletion: number
}

export async function notificationBeforeDeletionForInactivityEmail({
  ctx,
  loginUrl,
  receiverEmail,
  userName,
  daysBeforeDeletion,
}: InactivityDeletionNotificationEmailProps) {
  const senderInfo = await main.getSenderInfo(ctx)
  const title = `${userName} we are missing you at ${senderInfo.name}`

  const body = (
    <div style={contentStyle}>
      Hi {userName} we noticed you are not logging in for a while.
      <br />
      Our policies require us to delete inactive accounts.
      <br />
      If you don&apos;t log in within the next {daysBeforeDeletion} days, your account{' '}
      <span style={contentDeleteSpan}>will be deleted permanently</span>.
      <br />
      All your personal information and contributions{' '}
      <span style={contentDeleteSpan}>will be removed.</span>
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
        title: `Log in to ${senderInfo.name} now`,
        url: loginUrl,
      },
      hideIgnoreMessage: true,
    },
  })
}

const contentStyle: React.CSSProperties = {
  textAlign: 'left',
}

const contentDeleteSpan: React.CSSProperties = {
  borderRadius: '5px',
  padding: '3px 7px',
  background: '#ff0000',
  color: '#ffffff',
}
