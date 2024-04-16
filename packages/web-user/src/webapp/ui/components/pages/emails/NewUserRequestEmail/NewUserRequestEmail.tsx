import type { EmailLayoutProps } from '@moodlenet/component-library'
import { EmailLayout } from '@moodlenet/component-library'

export type NewUserRequestEmailProps = Partial<EmailLayoutProps> & {
  instanceName: string
}

export const NewUserRequestEmail = ({
  actionUrl,
  receiverEmail,
  instanceName,
}: NewUserRequestEmailProps) => {
  const title = `Welcome to ${instanceName} 🎉`

  const content = (
    <>
      Thanks for signing up to {instanceName}!<br />
      Click the button below to activate your account.
    </>
  )

  return (
    <EmailLayout
      subject={title}
      content={content}
      title={title}
      actionTitle={`Activate account`}
      actionUrl={actionUrl}
      receiverEmail={receiverEmail}
    />
  )
}

NewUserRequestEmail.defaultProps = {
  instanceName: 'MoodleNet',
} as NewUserRequestEmailProps

export default NewUserRequestEmail
