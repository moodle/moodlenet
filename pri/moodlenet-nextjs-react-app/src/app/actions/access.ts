'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuthTokenCookie, setAuthTokenCookie } from '../../lib/server/auth'
import client from '../../lib/server/session-client'

export async function logout() {
  const { sessionToken } = await getAuthTokenCookie()
  sessionToken && client.proxy.userAccount.authenticated.invalidateSession()
  await setAuthTokenCookie(null)
  revalidatePath('/', 'layout')
  redirect('/')
}
