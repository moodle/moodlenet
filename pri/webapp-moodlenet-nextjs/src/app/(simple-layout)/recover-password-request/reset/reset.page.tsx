import { signed_token_schema } from '@moodle/lib-types'
import { ResetPasswordClient } from './reset.client'

export default async function ResetPage({ searchParams }: { searchParams?: { token?: string } }) {
  const { success, data: resetPasswordToken } = signed_token_schema.safeParse(searchParams?.token)
  if (!success) {
    return 'invalid token'
  }

  return <ResetPasswordClient resetPasswordToken={resetPasswordToken} />
}
