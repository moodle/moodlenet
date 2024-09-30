import { priAccess } from '../../../../lib/server/session-access'
import SignupPanel from './signup-email-pwd.client'

export default async function SignupEmailPwdPage() {
  const { iamSchemaConfigs } = await priAccess().netWebappNextjs.schemaConfigs.iam()

  return (
    <SignupPanel
      {...{
        iamSchemaConfigs,
      }}
    />
  )
}
