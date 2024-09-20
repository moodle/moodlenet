import { getMod } from '../../../../lib/server/session-access'
import { ResetPasswordClient } from './reset.client'

export default async function ResetPage({
  searchParams,
}: {
  searchParams?: { token: string | string[] | undefined }
}) {
  const resetPasswordToken = searchParams?.token
  if (!resetPasswordToken || Array.isArray(resetPasswordToken)) {
    return new Response(`missing required token`, {
      status: 400,
    })
  }
  const iam_v1_0_pri = getMod().moodle.iam.v1_0.pri
  const { iam } = await iam_v1_0_pri.configs.read()

  return (
    <ResetPasswordClient
      primaryMsgSchemaConfigs={iam.primaryMsgSchemaConfigs}
      resetPasswordToken={resetPasswordToken}
    />
  )
}
