import { NextRequest } from 'next/server'
import { getMod } from '../../../../../../lib/server/session-access'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { setAuthTokenCookie } from '../../../../../../lib/server/auth'

export async function GET(req: NextRequest) {
  const signupEmailVerificationToken = await req.nextUrl.searchParams.get('token')
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
            signup: { verifyEmail },
            session: { generateUserSession: generateSession },
          },
        },
      },
    },
  } = getMod()
  const [ok, response] = await verifyEmail({ signupEmailVerificationToken })
  if (!ok) {
    return new Response(`error verifying email. reason: ${response.reason}`, {
      status: 400,
    })
  }
  const [done, session] = await generateSession({ userId: response.userId })
  if (!done) {
    return new Response(`error generating session token. reason: ${session.reason}`, {
      status: 400,
    })
  }
  setAuthTokenCookie(session)
  revalidatePath('/', 'layout')
  redirect('/')
}
