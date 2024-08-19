import type { EmailObj } from '@moodlenet/email-service/server'

export type PasswordChangedEmailProps = {
  receiverEmail: string
}

export function passwordChangedEmail({ receiverEmail }: PasswordChangedEmailProps): EmailObj {
  const title = `Password changed 🔒💫`
  const body = `Your password has been successfully changed. If it was not you, recover your password and keep in safer.`
  return {
    body,
    receiverEmail,
    subject: title,
    title,
    hideIgnoreMessage: false,
  }
}
