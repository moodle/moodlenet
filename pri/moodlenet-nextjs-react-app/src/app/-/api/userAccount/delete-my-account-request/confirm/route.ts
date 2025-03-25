import { signed_token_schema } from '@moodle/lib-types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { setAuthTokenCookie } from '../../../../../../lib/server/auth'
import session from '../../../../../../lib/server/session-client'

export async function GET(req: NextRequest) {
  const { success, data: selfDeletionConfirmationToken } = signed_token_schema.safeParse(req.nextUrl.searchParams.get('token'))
  if (!success) {
    return new Response(`invalid token`, {
      status: 400,
    })
  }

  const [ok, response] = await client.proxy.userAccount.signedTokenAccess.confirmSelfDeletionRequest({
    selfDeletionConfirmationToken,
    reason: '',
  })
  if (!ok) {
    return new Response(`error confirming account deletion. reason: ${response.reason}`, {
      status: 400,
    })
  }
  await setAuthTokenCookie(null)
  revalidatePath('/', 'layout')
  redirect('/')
}
