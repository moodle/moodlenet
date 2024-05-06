// NewUserRequestEmail.stories.js
import { render } from '@react-email/render'
import type { NewUserRequestEmailProps } from './NewUserRequestEmail.js'
import { NewUserRequestEmail } from './NewUserRequestEmail.js'

export default {
  title: 'Pages/Emails/Access/NewUserRequestEmail',
  component: NewUserRequestEmail,
  parameters: { layout: 'no-wrapper' },
}

const EmailTemplate = () => {
  const props: NewUserRequestEmailProps = {
    instanceName: 'MoodleNet',
    actionUrl: 'https://moodle.net/profile/trG4VCzT/john-kuti',
  }

  const html = render(<NewUserRequestEmail {...props} />)

  return <div style={{ height: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />
}

export const Default = EmailTemplate.bind({})
