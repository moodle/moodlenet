import { priAccess } from '../../../../lib/server/session-access'
import SignupPanel from './signup-email-pwd.client'

export default async function SignupEmailPwdPage() {
  const { iam } = await priAccess().moodle.iam.v1_0.pri.configs.read()

  return (
    <SignupPanel
      {...{
        primaryMsgSchemaConfigs: iam.primaryMsgSchemaConfigs,
      }}
    />
  )
}
