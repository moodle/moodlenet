import { getMod } from '../../../../lib/server/session-access'
import LoginPanel from './login-email-pwd.client'

export default async function LoginEmailPwdPage() {
  const {
    /// move to layout ?
    moodle: {
      iam: {
        v1_0: { pri },
      },
    },
  } = getMod()
  const { iam } = await pri.configs.read()
  return (
    <LoginPanel
      {...{
        recoverPasswordUrl: '##############',
        primaryMsgSchemaConfigs: iam.primaryMsgSchemaConfigs,
      }}
    />
  )
}
