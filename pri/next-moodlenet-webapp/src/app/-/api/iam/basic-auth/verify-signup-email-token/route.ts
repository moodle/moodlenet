import { NextRequest } from 'next/server'
import { priAccess } from '../../../../../../lib/server/session-access'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { setAuthTokenCookie } from '../../../../../../lib/server/auth'
import { encrypted_token_schema } from '@moodle/lib-types'

export async function GET(req: NextRequest) {
  const signupEmailVerificationToken = encrypted_token_schema.parse(
    await req.nextUrl.searchParams.get('token'),
  )
  if (!signupEmailVerificationToken) {
    return new Response(`missing required token`, {
      status: 400,
    })
  }
  const {
    moodle: {
      iam: {
        v1_0: {
          pri: {
            access: { createNewUserByEmailVerificationToken },
            session: { generateUserSession },
          },
        },
      },
    },
  } = priAccess()
  const [ok, response] = await createNewUserByEmailVerificationToken({
    signupEmailVerificationToken,
  })
  if (!ok) {
    return new Response(`error verifying email. reason: ${response.reason}`, {
      status: 400,
    })
  }
  const [done, session] = await generateUserSession({ userId: response.userId })
  if (!done) {
    return new Response(`error generating session token. reason: ${session.reason}`, {
      status: 400,
    })
  }
  setAuthTokenCookie(session)
  revalidatePath('/', 'layout')
  redirect('/')
}
