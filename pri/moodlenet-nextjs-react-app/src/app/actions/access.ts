'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuthTokenCookie, setAuthTokenCookie } from '../../lib/server/auth'
import session from '../../lib/server/session-client'

export async function logout() {
  const [{ sessionToken }, gate] = await Promise.all([getAuthTokenCookie(), session.client.gate])
  sessionToken && gate.authenticated.myAccount.security.authentication.invalidateSession()
  await setAuthTokenCookie(null)
  revalidatePath('/', 'layout')
  redirect('/')
}
