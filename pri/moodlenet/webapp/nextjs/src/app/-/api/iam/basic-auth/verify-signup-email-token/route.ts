import { NextRequest } from 'next/server'
import { getMod } from '../../../../../../lib/server/session-access'

export async function GET(req: NextRequest) {
  const signupEmailVerificationToken = await req.nextUrl.searchParams.get('token')
  if (!signupEmailVerificationToken) {
    return new Response(`missing required token`, {
      status: 400,
    })
  }
  const {
    moodle: {
      iam: {
        v1_0: {
          pri: {
            signup: { verifyEmail },
          },
        },
      },
    },
  } = getMod()
  const [ok, response] = await verifyEmail({ signupEmailVerificationToken })
  console.log({ ok, response })
  if (!ok) {
    return new Response(`error verifying email: reason: ${response.reason}`, {
      status: 400,
    })
  }
  return Response.json(response)
}
