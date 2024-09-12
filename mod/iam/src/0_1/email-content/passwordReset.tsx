import { v0_1 as org_0_1 } from '@moodle/mod-org'

export type ResetPasswordContentEmailProps = {
  receiverEmail: string
  resetPasswordUrl: string
}

export function resetPasswordContent({
  resetPasswordUrl,
  receiverEmail,
}: ResetPasswordContentEmailProps): org_0_1.EmailLayoutContentProps {
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
      url: resetPasswordUrl,
    },
  }
}