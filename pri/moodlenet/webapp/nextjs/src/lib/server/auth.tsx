import { lib_moodle_iam } from '@moodle/lib-domain'
import { cookies } from 'next/headers'

const AUTH_COOKIE = 'moodlenet-auth'
export function getAuthTokenCookie() {
  const cookie = cookies().get(AUTH_COOKIE)

  return cookie?.value ?? null
}
export function setAuthTokenCookie(session: null | lib_moodle_iam.v1_0.session) {
  const reqCookie = session
    ? cookies().set(AUTH_COOKIE, session.token, {
        path: '/',
        expires: new Date(session.expires),
      })
    : cookies().delete(AUTH_COOKIE)
  return reqCookie
}
