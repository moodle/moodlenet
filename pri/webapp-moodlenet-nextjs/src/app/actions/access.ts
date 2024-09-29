'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuthTokenCookie, setAuthTokenCookie } from '../../lib/server/auth'
import { priAccess } from '../../lib/server/session-access'

export async function logout() {
  const { sessionToken } = getAuthTokenCookie()
  sessionToken && priAccess().moodle.iam.pri.access.logout({ sessionToken })
  setAuthTokenCookie(null)
  revalidatePath('/')
  redirect('/')
}
