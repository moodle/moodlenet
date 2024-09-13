'use server'

import { lib_moodle_iam } from '@moodle/lib-domain'
import { redirect } from 'next/navigation'
import { getMod } from '../../../../lib/server/session-access'
import { srvSiteUrls } from '../../../../lib/server/utils/site-urls.server'

export type signupResponse = void | Awaited<ReturnType<typeof signup>>
export async function signup(signupForm: lib_moodle_iam.v0_1.signupForm) {
  const {
    moodle: {
      iam: {
        v0_1: {
          pri: { signup },
        },
      },
    },
  } = getMod()
  const siteUrls = await srvSiteUrls()
  const redirectUrl = siteUrls.full.apis.iam.basicAuth.verifySignupEmailToken
  const [signupDone, signupResponse] = await signup.request({ signupForm, redirectUrl })
  console.log({ signupDone, signupResponse })
  if (!signupDone) {
    return signupResponse
  }
  redirect('/')
}

