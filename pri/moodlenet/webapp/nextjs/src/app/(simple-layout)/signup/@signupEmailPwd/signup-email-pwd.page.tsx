import { getMod } from '../../../../lib/server/session-access'
import SignupPanel from './signup-email-pwd.client'

export default async function SignupEmailPwdPage() {
  const {
    moodle: {
      iam: {
        v1_0: { pri },
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
