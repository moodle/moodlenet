import { getMod } from '../../../../lib/server/session-access'
import SignupPanel from './signup-email-pwd.client'

export default async function SignupEmailPwdPage() {
  const iam_v1_0_pri = getMod().moodle.iam.v1_0.pri
  const { iam } = await iam_v1_0_pri.configs.read()

  return (
    <SignupPanel
      {...{
        primaryMsgSchemaConfigs: iam.primaryMsgSchemaConfigs,
      }}
    />
  )
}
