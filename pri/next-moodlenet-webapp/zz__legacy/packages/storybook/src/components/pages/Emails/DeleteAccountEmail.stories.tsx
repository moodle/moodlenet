import { EmailLayout } from '@moodlenet/component-library/email-templates'
import { render } from '@react-email/render'
import { deleteAccountEmail } from '../../../../../web-user/src/common/emails/Access/DeleteAccountEmail/DeleteAccountEmail'
import { defaultEmailOrganization } from './defaults.mjs'

export default {
  title: 'Pages/Emails/Access/DeleteAccountEmail',
  // component: MessageReceivedEmail,
  parameters: { layout: 'no-wrapper' },
}

const EmailTemplate = () => {
  const content = deleteAccountEmail({
    instanceName: 'MoodleNet',
    actionUrl: 'https://moodle.net/notfound',
    receiverEmail: 'john_kuti@example.email',
  })

  const html = render(<EmailLayout content={content} organization={defaultEmailOrganization} />)

  return <div style={{ height: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />
}

export const Default = EmailTemplate.bind({})
