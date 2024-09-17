import { render } from '@react-email/render'
// import { EmailLayout } from '@moodlenet/component-library/email-templates'
import PasswordChangedEmail from '../../../../../simple-email-auth/src/common/emails/PasswordChangedEmail/PasswordChangedEmail'

export default {
  title: 'Pages/Emails/Access/PasswordChangedEmail',
  component: PasswordChangedEmail,
  parameters: { layout: 'no-wrapper' },
}

const EmailTemplate = () => {
  const html = render(<PasswordChangedEmail />)

  return <div style={{ height: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />
}

export const Default = EmailTemplate.bind({})
