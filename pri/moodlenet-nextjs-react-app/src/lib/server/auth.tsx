import { signed_expire_token, signed_token_schema } from '@moodle/lib-types'
import { cookies } from 'next/headers'

const AUTH_COOKIE = 'moodle-auth'
export async function getAuthTokenCookie() {
  const { success, data: token } = signed_token_schema.safeParse((await cookies()).get(AUTH_COOKIE)?.value)
  return { sessionToken: success ? token : null }
}

export async function setAuthTokenCookie(session: null | signed_expire_token) {
  // FIXME: review cookie options for security concerns
  const reqCookie = session
    ? (await cookies()).set(AUTH_COOKIE, session.token, {
        path: '/',
        expires: new Date(session.expires),
        httpOnly: true,
      })
    : (await cookies()).delete(AUTH_COOKIE)
  return reqCookie
}
