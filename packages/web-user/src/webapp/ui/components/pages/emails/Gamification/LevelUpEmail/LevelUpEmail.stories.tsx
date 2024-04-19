// LevelUpEmail.stories.js
import { render } from '@react-email/render'
import { LevelUpEmail, type LevelUpEmailProps } from './LevelUpEmail.js'

export default {
  title: 'Pages/Emails/Gamification/LevelUpEmail',
  component: LevelUpEmail,
  parameters: { layout: 'no-wrapper' },
}

const EmailTemplate = () => {
  const props: LevelUpEmailProps = {
    instanceName: 'MoodleNet',
    points: 100030,
    actionUrl: 'https://moodle.net/profile/PqgqvuDd/martin-dougiamas',
  }

  const html = render(<LevelUpEmail {...props} />)

  return <div style={{ height: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />
}

export const Default = EmailTemplate.bind({})
