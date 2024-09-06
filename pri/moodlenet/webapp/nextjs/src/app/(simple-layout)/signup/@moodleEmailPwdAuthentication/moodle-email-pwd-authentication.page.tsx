import { getMod } from '../../../../lib/server/session-access'
import SignupPanel from './moodle-email-pwd-authentication.client'

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
    <SignupPanel
      {...{
        validationConfigs: configs.validations,
      }}
    />
  )
}
