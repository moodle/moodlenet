import { redirect } from 'next/navigation'
import { setAuthTokenCookie } from '../../../../lib/server/auth'

export async function GET() {
  await setAuthTokenCookie(null)
  redirect('/')
}
