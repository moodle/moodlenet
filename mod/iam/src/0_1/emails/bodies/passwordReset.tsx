import type { EmailObj } from '@moodlenet/email-service/server'

export type RecoverPasswordEmailProps = {
  receiverEmail: string
  actionUrl: string
}

export function recoverPasswordEmail({
  actionUrl,
  receiverEmail,
}: RecoverPasswordEmailProps): EmailObj {
  const title = `Ready to change your password 🔑`
  const body = `Someone (probably you) requested a password change on MoodleNet. If that was you, please click on the button below and choose a new password for your account.`

  return {
    body,
    receiverEmail,
    subject: title,
    title,
    hideIgnoreMessage: false,
    action: {
      title: 'Change password',
      url: actionUrl,
    },
  }
}
