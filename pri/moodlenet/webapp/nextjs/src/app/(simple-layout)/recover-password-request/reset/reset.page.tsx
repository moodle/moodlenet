import { priAccess } from '../../../../lib/server/session-access'
import { ResetPasswordClient } from './reset.client'

export default async function ResetPage({
  searchParams,
}: {
  searchParams?: { token: string | string[] | undefined }
}) {
  const resetPasswordToken = searchParams?.token
  if (!resetPasswordToken || Array.isArray(resetPasswordToken)) {
    return 'invalid token'
  }
  const { iam } = await priAccess().moodle.iam.v1_0.pri.configs.read()

  return (
    <ResetPasswordClient
      primaryMsgSchemaConfigs={iam.primaryMsgSchemaConfigs}
      resetPasswordToken={resetPasswordToken}
    />
  )
}
