import type { EmailObj } from '@moodlenet/email-service/server'

export type NewUserRequestEmailProps = {
  instanceName: string
  actionUrl: string
  receiverEmail: string
}

export function newUserRequestEmail({
  actionUrl,
  receiverEmail,
  instanceName,
}: NewUserRequestEmailProps): EmailObj {
  const title = `Welcome to ${instanceName} 🎉`

  const body = (
    <>
      Thanks for signing up to {instanceName}!<br />
      <br />
      Click the button below to activate your account.
    </>
  )

  return {
    body,
    receiverEmail,
    subject: title,
    title,
    action: { title: 'Activate account', url: actionUrl },
    hideIgnoreMessage: false,
  }
}
