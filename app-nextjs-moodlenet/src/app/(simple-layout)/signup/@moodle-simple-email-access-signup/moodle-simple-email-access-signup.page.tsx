import { sessionContext } from '@/lib/server/sessionContext'
import SignupPanel from './moodle-simple-email-access-signup.client'

export default async function MoodleSimpleEmailAccessSignupPage() {
  const { website } = await sessionContext()
  const mod = await website.modules('moodleSimpleEmailAccess')

  return (
    <SignupPanel
      {...{
        configs: mod.configs.signupForm,
      }}
    />
  )
}
