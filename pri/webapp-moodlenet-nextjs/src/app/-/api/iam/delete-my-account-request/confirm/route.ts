import { signed_token_schema } from '@moodle/lib-types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { setAuthTokenCookie } from '../../../../../../lib/server/auth'
import { primary } from '../../../../../../lib/server/session-access'

export async function GET(req: NextRequest) {
  const { success, data: selfDeletionConfirmationToken } = signed_token_schema.safeParse(
    req.nextUrl.searchParams.get('token'),
  )
  if (!success) {
    return new Response(`invalid token`, {
      status: 400,
    })
  }

  const [ok, response] = await primary.moodle.iam.myAccount.confirmSelfDeletionRequest({
    selfDeletionConfirmationToken,
    reason: '',
  })
  if (!ok) {
    return new Response(`error confirming account deletion. reason: ${response.reason}`, {
      status: 400,
    })
  }
  setAuthTokenCookie(null)
  revalidatePath('/', 'layout')
  redirect('/')
}
