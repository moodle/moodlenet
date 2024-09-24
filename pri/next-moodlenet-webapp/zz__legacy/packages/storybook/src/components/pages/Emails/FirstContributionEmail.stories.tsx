// FirstContributionEmail.stories.js
import { render } from '@react-email/render'
import type { FirstContributionEmailProps } from '../../../../../web-user/src/common/emails/FirstContributionEmail/FirstContributionEmail'
import FirstContributionEmail from '../../../../../web-user/src/common/emails/FirstContributionEmail/FirstContributionEmail'

export default {
  title: 'Pages/Emails/Publisher/FirstContribution',
  // component: FirstContributionEmail,
  parameters: { layout: 'no-wrapper' },
}

const EmailTemplate = () => {
  const props: FirstContributionEmailProps = {
    instanceName: 'MoodleNet',
    actionUrl: 'https://moodle.net/changepassword',
  }

  const html = render(<FirstContributionEmail {...props} />)

  return <div style={{ height: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />
}

export const Default = EmailTemplate.bind({})
