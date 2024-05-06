import { render } from '@react-email/render'
import { MessageReceivedEmail } from '../MessageReceivedEmail/MessageReceivedEmail.js'
import type { DeleteAccountEmailProps } from './DeleteAccountEmail.js'
import { DeleteAccountEmail } from './DeleteAccountEmail.js'

export default {
  title: 'Pages/Emails/Access/DeleteAccountEmail',
  component: MessageReceivedEmail,
  parameters: { layout: 'no-wrapper' },
}

const EmailTemplate = () => {
  const props: DeleteAccountEmailProps = {
    instanceName: 'MoodleNet',
    actionUrl: 'https://moodle.net/notfound',
  }

  const html = render(<DeleteAccountEmail {...props} />)

  return <div style={{ height: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />
}

export const Default = EmailTemplate.bind({})
