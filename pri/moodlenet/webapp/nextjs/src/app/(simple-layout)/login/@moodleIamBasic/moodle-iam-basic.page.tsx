import { getMod } from '../../../../lib/server/session-access'
import LoginPanel from './moodle-iam-basic.client'

export default async function MoodleIamBasicPage() {
  const {
    moodle: {
      iam: {
        v0_1: { pri },
      },
    },
  } = getMod()
  const { iam } = await pri.configs.read()
  return (
    <LoginPanel
      {...{
        recoverPasswordUrl: '##############',
        wrongCreds: false,
        primaryMsgSchemaConfigs: iam.primaryMsgSchemaConfigs,
      }}
    />
  )
}
