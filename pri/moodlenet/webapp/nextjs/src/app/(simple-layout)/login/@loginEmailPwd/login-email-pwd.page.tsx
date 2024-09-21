import { priAccess } from '../../../../lib/server/session-access'
import LoginPanel from './login-email-pwd.client'

export default async function LoginEmailPwdPage() {
  const {
    /// move to layout ?
    moodle: {
      iam: {
        v1_0: { pri },
      },
    },
  } = priAccess()
  const { iam } = await pri.configs.read()
  return (
    <LoginPanel
      {...{
        primaryMsgSchemaConfigs: iam.primaryMsgSchemaConfigs,
      }}
    />
  )
}
