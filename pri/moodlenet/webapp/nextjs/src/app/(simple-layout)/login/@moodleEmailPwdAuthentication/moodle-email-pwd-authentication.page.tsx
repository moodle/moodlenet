import { getMod } from '../../../../lib/server/session-access'
import LoginPanel from './moodle-email-pwd-authentication.client'

export default async function MoodleEmailPwdAuthenticationPage() {
  const {
    moodle: {
      iam: {
        v0_1: { pri: mod },
      },
    },
  } = getMod()
  const { configs } = await mod.configs.read()
  return (
    <LoginPanel
      {...{
        recoverPasswordUrl: '',
        wrongCreds: false,
        validationConfigs: configs.validations,
      }}
    />
  )
}
