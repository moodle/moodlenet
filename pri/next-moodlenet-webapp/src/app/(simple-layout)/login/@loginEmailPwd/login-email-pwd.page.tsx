import { priAccess } from '../../../../lib/server/session-access'
import LoginPanel from './login-email-pwd.client'

export default async function LoginEmailPwdPage(/* {
  searchParams,
}: {
  searchParams?: { redirect?: string }
} */) {
  const { iam } = await priAccess().moodle.iam.v1_0.pri.configs.read()
  return (
    <LoginPanel
      {...{
        primaryMsgSchemaConfigs: iam.primaryMsgSchemaConfigs,
      }}
    />
  )
}
