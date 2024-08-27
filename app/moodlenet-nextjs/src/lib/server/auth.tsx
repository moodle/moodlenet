import { cookies } from 'next/headers'

const AUTH_COOKIE = 'auth'
export  function getAuthToken() {
  const cookie = cookies().get(AUTH_COOKIE)
  return cookie?.value
}
export  function setAuthToken(token: string) {
  const reqCookie = cookies().set(AUTH_COOKIE, token, {})
  return reqCookie
}
