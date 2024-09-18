'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { setAuthTokenCookie } from '../../lib/server/auth'

export async function logout() {
  setAuthTokenCookie(null)
  revalidatePath('/')
  redirect('/')
}
