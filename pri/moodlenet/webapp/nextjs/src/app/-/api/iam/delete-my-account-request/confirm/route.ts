import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { setAuthTokenCookie } from '../../../../../../lib/server/auth'
import { priAccess } from '../../../../../../lib/server/session-access'

export async function GET(req: NextRequest) {
  const selfDeletionConfirmationToken = await req.nextUrl.searchParams.get('token')
  if (!selfDeletionConfirmationToken) {
    return new Response(`missing required token`, {
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
