import { EmailLayout, EmailLayoutProps } from '@moodlenet/component-library'

export type DeleteAccountEmailProps = Partial<EmailLayoutProps> & {
  displayName: string
  message: string
  instanceName: string
}

export const DeleteAccountEmail = ({ instanceName, actionUrl }: DeleteAccountEmailProps) => {
  const title = `Confirm account deletion 🥀`

  const content = (
    <div style={contentStyle}>
      The deletion of your {instanceName} account means that:
      <br />
      <ul style={listStyle}>
        <li>
          All your personal information <span style={contentDeleteSpan}>will be removed.</span>
        </li>
        <li>Your contributions will be kept as anonymous.</li>
      </ul>
      Feel free to remove any content you don't want to be kept.
    </div>
  )

  return (
    <EmailLayout
      subject={title}
      content={content}
      title={title}
      actionTitle="Delete account permanently"
      actionUrl={actionUrl}
      actionButtonStyle={{ background: '#ff0000', color: '#ffffff' }}
    />
  )
}

const contentStyle = {
  textAlign: 'left',
}

const listStyle = {
  textAlign: 'left',
  margin: '22px 22px',
  paddingLeft: '30px',
}

const contentDeleteSpan = {
  borderRadius: '5px',
  padding: '3px 6px',
  background: '#ff0000b5',
  color: '#ffffff',
}
