import { priAccess } from '../../../../lib/server/session-access'
import LoginPanel from './login-email-pwd.client'

export default async function LoginEmailPwdPage(/* {
  searchParams,
}: {
  searchParams?: { redirect?: string }
} */) {
  const { iamSchemaConfigs } = await priAccess().netWebappNextjs.schemaConfigs.iam()
  return (
    <LoginPanel
      {...{
        iamSchemaConfigs,
      }}
    />
  )
}
