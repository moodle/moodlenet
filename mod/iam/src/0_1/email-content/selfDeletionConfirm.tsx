import { v0_1 as org_0_1 } from '@moodle/mod-org'

export type DeleteAccountEmailProps = {
  orgInfo: org_0_1.OrgInfo
  deleteAccountUrl: string
  receiverEmail: string
}

export function selfDeletionConfirmContent({
  orgInfo,
  deleteAccountUrl,
  receiverEmail,
}: DeleteAccountEmailProps): org_0_1.EmailLayoutContentProps {
  const title = `Confirm account deletion 🥀`

  const body = (
    <div style={contentStyle}>
      The deletion of your {orgInfo.name} account means that:
      <br />
      <ul style={listStyle}>
        <li>
          All your personal information <span style={contentDeleteSpan}>will be removed.</span>
        </li>
        <li>Your contributions will be kept anonymous.</li>
      </ul>
      Before deleting your account, feel free to unpublish or remove any content you don&apos;t want
      to be kept.
    </div>
  )

  return {
    body,
    receiverEmail,
    subject: title,
    title,
    action: {
      title: 'Delete account permanently',
      url: deleteAccountUrl,
      buttonStyle: { background: '#ff0000', color: '#ffffff' },
    },
    hideIgnoreMessage: true,
  }
}

const contentStyle: React.CSSProperties = {
  textAlign: 'left',
}

const listStyle: React.CSSProperties = {
  textAlign: 'left',
  margin: '22px 22px',
  paddingLeft: '30px',
}

const contentDeleteSpan: React.CSSProperties = {
  borderRadius: '5px',
  padding: '3px 7px',
  background: '#ff0000',
  color: '#ffffff',
}
