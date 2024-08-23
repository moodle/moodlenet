import { sessionContext } from '#lib/server/sessionContext'
import SignupPanel from './moodle-email-pwd-authentication.client'

export default async function MoodleEmailPwdAuthenticationPage() {
  const { website } = await sessionContext()
  const mod = await website.modules('moodle-email-pwd-authentication')

  return (
    <SignupPanel
      {...{
        configs: mod.configs.signupForm,
      }}
    />
  )
}
