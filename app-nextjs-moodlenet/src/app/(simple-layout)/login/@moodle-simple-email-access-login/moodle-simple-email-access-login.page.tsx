import { sessionContext } from '@/lib/server/sessionContext'
import LoginPanel from './moodle-simple-email-access-login.client'

export default async function MoodleSimpleEmailAccessLoginPage() {
  const { website } = await sessionContext()
  const mod = await website.modules('moodle-simple-email-access')

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
