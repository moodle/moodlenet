import { getMod } from '../../../../lib/server/session-access'
import LoginPanel from './moodle-iam-basic.client'

export default async function MoodleIamBasicPage() {
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
