'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuthTokenCookie, setAuthTokenCookie } from '../../lib/server/auth'
import { access } from '../../lib/server/session-access'

export async function logout() {
  const { sessionToken } = getAuthTokenCookie()
  sessionToken && access.primary.userAccount.access.logout({ sessionToken })
  setAuthTokenCookie(null)
  revalidatePath('/')
  redirect('/')
}
