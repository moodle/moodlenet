import type { EmailObj } from '@moodlenet/email-service/server'

export type InactivityDeletionNotificationEmailProps = {
  instanceName: string
  loginUrl: string
  receiverEmail: string
  displayName: string
  daysBeforeDeletion: number
}

export function inactivityDeletionNotificationEmail({
  instanceName,
  loginUrl,
  receiverEmail,
  displayName,
  daysBeforeDeletion,
}: InactivityDeletionNotificationEmailProps): EmailObj {
  const title = `${displayName} we are missing you at ${instanceName}`

  const body = (
    <div style={contentStyle}>
      Hi {displayName} we noticed you are not logging in for a while.
      <br />
      Our policies require us to delete inactive accounts. If you don&apos;t log in within the next{' '}
      ${daysBeforeDeletion} days, your account{' '}
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
      title: `Log in to ${instanceName} now`,
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
