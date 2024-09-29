import { CoreContext } from '@moodle/lib-ddd'
import React from 'react'
import * as email_org from '../../org'

export type InactivityDeletionNotificationEmailProps = {
  ctx: Pick<CoreContext, 'sys_call'>
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
  const senderInfo = await email_org.getSenderInfo(ctx)
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

  return email_org.layoutEmail({
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
