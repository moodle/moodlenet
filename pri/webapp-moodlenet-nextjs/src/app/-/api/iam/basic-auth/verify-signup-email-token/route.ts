import { signed_token_schema } from '@moodle/lib-types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { setAuthTokenCookie } from '../../../../../../lib/server/auth'
import { access } from '../../../../../../lib/server/session-access'

export async function GET(req: NextRequest) {
  const signupEmailVerificationToken = signed_token_schema.parse(await req.nextUrl.searchParams.get('token'))
  if (!signupEmailVerificationToken) {
    return new Response(`missing required token`, {
      status: 400,
    })
  }

  const [ok, response] = await access.primary.userAccount.access.createNewUserByEmailVerificationToken({
    signupEmailVerificationToken,
  })
  if (!ok) {
    return new Response(`error verifying email. reason: ${response.reason}`, {
      status: 400,
    })
  }
  const [done, session] = await access.primary.userAccount.session.generateUserSessionToken({
    userAccountId: response.userAccountId,
  })
  if (!done) {
    return new Response(`error generating session token. reason: ${session.reason}`, {
      status: 400,
    })
  }
  setAuthTokenCookie(session.userSessionToken)
  revalidatePath('/', 'layout')
  redirect('/')
}
