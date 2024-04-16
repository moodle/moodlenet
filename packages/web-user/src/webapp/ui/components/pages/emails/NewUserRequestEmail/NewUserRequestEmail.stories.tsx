// NewUserRequestEmail.stories.js
import { render } from '@react-email/render'
import { NewUserRequestEmail, NewUserRequestEmailProps } from './NewUserRequestEmail.js'

export default {
  title: 'Pages/Emails/Access/NewUserRequestEmail',
  component: NewUserRequestEmail,
  parameters: { layout: 'no-wrapper' },
}

const EmailTemplate = () => {
  const props: NewUserRequestEmailProps = {
    actionUrl: 'https://moodle.net/profile/trG4VCzT/john-kuti',
  }

  const html = render(<NewUserRequestEmail {...props} />)

  return <div style={{ height: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />
}

export const Default = EmailTemplate.bind({})
