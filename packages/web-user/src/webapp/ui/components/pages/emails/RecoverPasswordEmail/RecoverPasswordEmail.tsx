import type { EmailLayoutProps } from '@moodlenet/component-library'
import { EmailLayout } from '@moodlenet/component-library'

export type RecoverPasswordEmailProps = Partial<EmailLayoutProps>

export const RecoverPasswordEmail = ({ actionUrl }: RecoverPasswordEmailProps) => {
  const title = `Ready to change your password 🔑`
  const content = `Someone (probably you) requested a password change on MoodleNet. If that was you, please click on the button below and choose a new password for your account.`

  return (
    <EmailLayout
      subject={title}
      content={content}
      title={title}
      actionTitle={`Change password`}
      actionUrl={actionUrl}
      showIgnoreMesage={true}
    />
  )
}

RecoverPasswordEmail.defaultProps = {} as RecoverPasswordEmailProps

export default RecoverPasswordEmail
