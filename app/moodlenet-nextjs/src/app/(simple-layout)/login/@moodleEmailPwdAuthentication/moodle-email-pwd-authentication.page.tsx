import { getAccess } from '../../../../lib/server/session-access'
import LoginPanel from './moodle-email-pwd-authentication.client'

export default async function MoodleEmailPwdAuthenticationPage() {
  const access = await getAccess()
  const { configs } = await access('moodle-eml-pwd-auth', 'read', 'configs', void 0).val

  return (
    <LoginPanel
      {...{
        recoverPasswordUrl: '',
        wrongCreds: false,
        configs: configs.loginForm,
      }}
    />
  )
}
