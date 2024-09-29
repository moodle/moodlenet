import { priAccess } from '../../../../lib/server/session-access'
import SignupPanel from './signup-email-pwd.client'

export default async function SignupEmailPwdPage() {
  const { iamSchemaConfigs } = await priAccess().moodle.netWebappNextjs.pri.schemaConfigs.iam()

  return (
    <SignupPanel
      {...{
        iamSchemaConfigs,
      }}
    />
  )
}
