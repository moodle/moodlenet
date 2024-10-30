import { signed_token_schema } from '@moodle/lib-types'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { sitepaths } from '../../../../../../lib/common/sitepaths'
import { access } from '../../../../../../lib/server/session-access'

export async function GET(req: NextRequest) {
  const signupEmailVerificationToken = signed_token_schema.parse(await req.nextUrl.searchParams.get('token'))
  if (!signupEmailVerificationToken) {
    return new Response(`missing required token`, {
      status: 400,
    })
  }

  const [ok, response] = await access.primary.userAccount.signedTokenAccess.createNewUserByEmailVerificationToken({
    signupEmailVerificationToken,
  })
  if (!ok) {
    return new Response(`error verifying email. reason: ${response.reason}`, {
      status: 400,
    })
  }

  redirect(sitepaths.login())
}
