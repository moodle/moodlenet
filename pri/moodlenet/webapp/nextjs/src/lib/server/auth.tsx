import { cookies } from 'next/headers'

const AUTH_COOKIE = 'moodlenet-auth'
export function getAuthTokenCookie() {
  const cookie = cookies().get(AUTH_COOKIE)
  return cookie?.value ?? null
}
export function setAuthTokenCookie(token: string /*, tokendata:{domain,expires,path} */) {
  //FIXME - add domain,expires,path from config .. no .. from tokendata
  const reqCookie = cookies().set(AUTH_COOKIE, token /* , {domain,expires,path} */)
  return reqCookie
}
