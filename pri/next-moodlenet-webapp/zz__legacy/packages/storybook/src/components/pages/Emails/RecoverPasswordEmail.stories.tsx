// RecoverPasswordEmail.stories.js
import { render } from '@react-email/render'
import type { RecoverPasswordEmailProps } from '../../../../../simple-email-auth/src/common/emails/RecoverPasswordEmail/RecoverPasswordEmail'
// import { EmailLayout } from '@moodlenet/component-library/email-templates'
import { RecoverPasswordEmail } from '../../../../../simple-email-auth/src/common/emails/RecoverPasswordEmail/RecoverPasswordEmail'

export default {
  title: 'Pages/Emails/Access/RecoverPassword',
  component: RecoverPasswordEmail,
  parameters: { layout: 'no-wrapper' },
}

const EmailTemplate = () => {
  const props: RecoverPasswordEmailProps = {
    actionUrl: 'https://moodle.net/changepassword',
  }

  const html = render(<RecoverPasswordEmail {...props} />)

  return <div style={{ height: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />
}

export const Default = EmailTemplate.bind({})
