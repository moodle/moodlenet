import { render } from '@react-email/render'
import PasswordChangedEmail from './PasswordChangedEmail.js'

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
