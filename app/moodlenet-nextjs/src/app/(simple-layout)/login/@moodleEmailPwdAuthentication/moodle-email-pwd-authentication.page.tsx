import { getMod } from '../../../../lib/server/session-access'
import LoginPanel from './moodle-email-pwd-authentication.client'

export default async function MoodleEmailPwdAuthenticationPage() {
  const {
    moodle: {
      eml_pwd_auth: {
        V0_1: { pri: mod },
      },
    },
  } = getMod()
  const { configs } = await mod.read.configs()
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
