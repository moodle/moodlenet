import React from 'react'
import { EmailLayoutContentProps } from '../email-layout'

export type inactivityBeforeDeletionNotificationEmailProps = {
  loginUrl: string
  userName: string
  daysBeforeDeletion: number
  siteName: string
}
export function notificationBeforeDeletionForInactivityEmail({
  loginUrl,
  userName,
  daysBeforeDeletion,
  siteName,
}: inactivityBeforeDeletionNotificationEmailProps): EmailLayoutContentProps {
  const title = `${userName} we are missing you at ${siteName}`

  const body = (
    <div style={contentStyle}>
      Hi {userName} we noticed you are not logging in for a while.
      <br />
      Our policies require us to delete inactive accounts.
      <br />
      If you don&apos;t log in within the next {daysBeforeDeletion} days, your account{' '}
      <span style={contentDeleteSpan}>will be deleted permanently</span>.
      <br />
      All your personal information and contributions <span style={contentDeleteSpan}>will be removed.</span>
    </div>
  )

  return {
    body,
    subject: title,
    title,
    action: {
      title: `Log in to ${siteName} now`,
      url: loginUrl,
    },
    hideIgnoreMessage: true,
  }
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
