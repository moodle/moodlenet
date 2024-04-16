// MessageReceivedEmail.stories.js
import { render } from '@react-email/render'
import { MessageReceivedEmail, MessageReceivedEmailProps } from './MessageReceivedEmail.js'

export default {
  title: 'Pages/Emails/Social/MessageReceivedEmail',
  component: MessageReceivedEmail,
  parameters: { layout: 'no-wrapper' },
}

const EmailTemplate = () => {
  const props: MessageReceivedEmailProps = {
    displayName: 'John Kuti',
    message:
      'Hey Charles! How are you doing? I hope you are well. I just wanted to say hi and see how you are doing. I hope you are having a great day!',
    actionUrl: 'https://moodle.net/profile/trG4VCzT/john-kuti',
  }

  const html = render(<MessageReceivedEmail {...props} />)

  return <div style={{ height: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />
}

export const Default = EmailTemplate.bind({})
