// MessageReceivedEmail.stories.js
import { EmailLayout } from '@moodlenet/component-library/email-templates'
import { render } from '@react-email/render'
import { messageReceivedEmail } from '../../../../../web-user/src/common/emails/Social/MessageReceivedEmail/MessageReceivedEmail.js'
import { defaultEmailOrganization } from './defaults.mjs'

export default {
  title: 'Pages/Emails/Social/MessageReceivedEmail',
  // component: MessageReceivedEmail,
  parameters: { layout: 'no-wrapper' },
}

const EmailTemplate = () => {
  const content = messageReceivedEmail({
    senderDisplayName: 'John Kuti',
    instanceName: 'MoodleNet',
    message:
      'Hey Charles! How are you doing? I hope you are well. I just wanted to say hi and see how you are doing. I hope you are having a great day!',
    actionUrl: 'https://moodle.net/profile/trG4VCzT/john-kuti',
    receiverEmail: 'john_kuti@example.email',
  })

  const html = render(<EmailLayout content={content} organization={defaultEmailOrganization} />)

  return <div style={{ height: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />
}

export const Default = EmailTemplate.bind({})
