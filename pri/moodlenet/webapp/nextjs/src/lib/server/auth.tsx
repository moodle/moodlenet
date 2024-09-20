import { session_obj } from '@moodle/mod-iam/v1_0/types'
import { cookies } from 'next/headers'

const AUTH_COOKIE = 'moodlenet-auth'
export function getAuthTokenCookie() {
  const cookie = cookies().get(AUTH_COOKIE)

  return cookie?.value ?? null
}
export function setAuthTokenCookie(session: null | session_obj) {
  const reqCookie = session
    ? cookies().set(AUTH_COOKIE, session.token, {
        path: '/',
        expires: new Date(session.expires),
      })
    : cookies().delete(AUTH_COOKIE)
  return reqCookie
}
