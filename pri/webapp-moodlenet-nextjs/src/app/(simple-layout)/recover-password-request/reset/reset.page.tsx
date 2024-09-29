import { signed_token_schema } from '@moodle/lib-types'
import { priAccess } from '../../../../lib/server/session-access'
import { ResetPasswordClient } from './reset.client'

export default async function ResetPage({ searchParams }: { searchParams?: { token?: string } }) {
  const { success, data: resetPasswordToken } = signed_token_schema.safeParse(searchParams?.token)
  if (!success) {
    return 'invalid token'
  }
  const { iamSchemaConfigs } = await priAccess().moodle.netWebappNextjs.pri.schemaConfigs.iam()

  return (
    <ResetPasswordClient
      iamSchemaConfigs={iamSchemaConfigs}
      resetPasswordToken={resetPasswordToken}
    />
  )
}
