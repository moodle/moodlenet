// NewUserRequestEmail.stories.js
import { EmailLayout } from '@moodlenet/component-library/email-templates'
import { render } from '@react-email/render'
import { newUserRequestEmail } from '../../../../../simple-email-auth/src/common/emails/NewUserRequestEmail/NewUserRequestEmail.js'
import { defaultEmailOrganization } from './defaults.mjs'

export default {
  title: 'Pages/Emails/Access/NewUserRequestEmail',
  component: newUserRequestEmail,
  parameters: { layout: 'no-wrapper' },
}

const EmailTemplate = () => {
  const emailContentProps = newUserRequestEmail({
    receiverEmail: 'john_kuti@example.com',
    instanceName: 'Moodlenet',
    actionUrl: 'https://moodle.net/profile/trG4VCzT/john-kuti',
  })

  const html = render(
    <EmailLayout content={emailContentProps} organization={defaultEmailOrganization} />,
  )

  return <div style={{ height: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />
}

export const Default = EmailTemplate.bind({})
