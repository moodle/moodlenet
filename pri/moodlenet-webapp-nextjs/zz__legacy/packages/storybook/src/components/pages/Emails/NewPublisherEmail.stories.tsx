// NewPublisherEmail.stories.js
import { render } from '@react-email/render'
import {
  NewPublisherEmail,
  type NewPublisherEmailProps,
} from '../../../../../web-user/src/common/emails/NewPublisherEmail/NewPublisherEmail'

export default {
  title: 'Pages/Emails/Publisher/NewPublisher',
  component: NewPublisherEmail,
  parameters: { layout: 'no-wrapper' },
}

const EmailTemplate = () => {
  const props: NewPublisherEmailProps = {
    instanceName: 'MoodleNet',
    actionUrl: 'https://moodle.net/changepassword',
  }

  const html = render(<NewPublisherEmail {...props} />)

  return <div style={{ height: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />
}

export const Default = EmailTemplate.bind({})
