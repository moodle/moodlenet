import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { setAuthTokenCookie } from '../../../../../../lib/server/auth'
import { priAccess } from '../../../../../../lib/server/session-access'
import { encrypted_token_schema } from '@moodle/lib-types'

export async function GET(req: NextRequest) {
  const { success, data: selfDeletionConfirmationToken } = encrypted_token_schema.safeParse(
    req.nextUrl.searchParams.get('token'),
  )
  if (!success) {
    return new Response(`invalid token`, {
      status: 400,
    })
  }
  const {
    moodle: {
      iam: {
        v1_0: {
          pri: {
            myAccount: { confirmSelfDeletionRequest },
          },
        },
      },
    },
  } = priAccess()
  const [ok, response] = await confirmSelfDeletionRequest({
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
