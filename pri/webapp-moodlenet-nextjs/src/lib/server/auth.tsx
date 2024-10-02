import { signed_expire_token, signed_token_schema } from '@moodle/lib-types'
import { cookies } from 'next/headers'

const AUTH_COOKIE = 'moodlenet-auth'
export function getAuthTokenCookie() {
  const { success, data: token } = signed_token_schema.safeParse(cookies().get(AUTH_COOKIE)?.value)

  return { sessionToken: success ? token : null }
}
export function setAuthTokenCookie(session: null | signed_expire_token) {
  const reqCookie = session
    ? cookies().set(AUTH_COOKIE, session.token, {
        path: '/',
        expires: new Date(session.expires),
      })
    : cookies().delete(AUTH_COOKIE)
  return reqCookie
}

