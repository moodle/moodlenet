import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { setAuthTokenCookie } from '../../../../lib/server/auth'

export async function GET(req: NextRequest) {
  await setAuthTokenCookie(null)
  const redirectUrl = req.nextUrl.searchParams.get('redirectBackTo')
  redirect(redirectUrl || '/')
}
