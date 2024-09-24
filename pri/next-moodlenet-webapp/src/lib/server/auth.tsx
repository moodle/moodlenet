import { encrypted_token_schema } from '@moodle/lib-types'
import { session_obj } from '@moodle/mod-iam/v1_0/types'
import { cookies } from 'next/headers'

const AUTH_COOKIE = 'moodlenet-auth'
export function getAuthTokenCookie() {
  const {success,data: token} = encrypted_token_schema.safeParse( cookies().get(AUTH_COOKIE)?.value)

  return { sessionToken: success ? token : null }
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
