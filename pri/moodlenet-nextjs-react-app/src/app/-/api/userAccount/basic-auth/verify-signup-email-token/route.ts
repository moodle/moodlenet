import { status4xx } from '@moodle/domain/lib'
import { signed_token_schema } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { appRoutes } from '../../../../../../lib/common/appRoutes'
import session from '../../../../../../lib/server/session-client'

export async function GET(req: NextRequest) {
  const { data: signupEmailVerificationToken } = signed_token_schema.safeParse(await req.nextUrl.searchParams.get('token'))
  if (!signupEmailVerificationToken) {
    return new Response(`bad token`, {
      status: status4xx('Bad Request'),
    })
  }

  const e_confirmMyEmailResponse = await client.proxy.anonymous.access.signup.withMyEmail.confirmMyEmail({
    signupEmailVerificationToken,
  })
  if (isLeft(e_confirmMyEmailResponse)) {
    return new Response(`invalid Token`, {
      status: status4xx('Not Acceptable'),
    })
  }

  redirect(appRoutes('/login'))
}
