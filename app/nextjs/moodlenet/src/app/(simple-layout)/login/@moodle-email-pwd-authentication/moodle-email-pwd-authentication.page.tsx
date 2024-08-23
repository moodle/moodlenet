import { sessionContext } from '#lib/server/sessionContext'
import LoginPanel from './moodle-email-pwd-authentication.client'

export default async function MoodleEmailPwdAuthenticationPage() {
  const { website } = await sessionContext()
  const mod = await website.modules('moodle-email-pwd-authentication')

  return (
    <LoginPanel
      {...{
        recoverPasswordUrl: '',
        wrongCreds: false,
        configs: mod.configs.loginForm,
      }}
    />
  )
}
