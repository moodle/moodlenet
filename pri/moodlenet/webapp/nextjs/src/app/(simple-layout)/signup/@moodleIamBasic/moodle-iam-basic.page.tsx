import { getMod } from '../../../../lib/server/session-access'
import SignupPanel from './moodle-iam-basic.client'

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
    <SignupPanel
      {...{
        primaryMsgSchemaConfigs: iam.primaryMsgSchemaConfigs,
      }}
    />
  )
}
