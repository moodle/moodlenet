import { v0_1 as org_0_1 } from '@moodle/mod-org'

export type InactivityDeletionNotificationEmailProps = {
  orgInfo: org_0_1.OrgInfo
  loginUrl: string
  receiverEmail: string
  userName: string
  daysBeforeDeletion: number
}

export function notificationBeforeDeletionForInactivityContent({
  orgInfo,
  loginUrl,
  receiverEmail,
  userName,
  daysBeforeDeletion,
}: InactivityDeletionNotificationEmailProps): org_0_1.EmailLayoutContentProps {
  const title = `${userName} we are missing you at ${orgInfo.name}`

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

  return {
    body,
    receiverEmail,
    subject: title,
    title,
    action: {
      title: `Log in to ${orgInfo.name} now`,
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
