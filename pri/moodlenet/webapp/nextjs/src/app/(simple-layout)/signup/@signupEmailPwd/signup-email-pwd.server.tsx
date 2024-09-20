'use server'

import { redirect } from 'next/navigation'
import { getMod } from '../../../../lib/server/session-access'
import { srvSiteUrls } from '../../../../lib/server/utils/site-urls.server'
import { signupForm } from '@moodle/mod-iam/v1_0/types'

export type signupResponse = void | Awaited<ReturnType<typeof signup>>
export async function signup(signupForm: signupForm) {
  const {
    moodle: {
      iam: {
        v1_0: {
          pri: { signup },
        },
      },
    },
  } = getMod()
  const siteUrls = await srvSiteUrls()
  const redirectUrl = siteUrls.full.apis.iam.basicAuth.verifySignupEmailToken
  const [signupDone, signupResponse] = await signup.request({ signupForm, redirectUrl })
  if (!signupDone) {
    return signupResponse
  }
  redirect('/')
}

