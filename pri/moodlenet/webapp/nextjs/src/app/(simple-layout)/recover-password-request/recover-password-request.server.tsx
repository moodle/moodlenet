'use server'

import { email_address } from '@moodle/lib-types'
import { priAccess } from '../../../lib/server/session-access'
import { srvSiteUrls } from '../../../lib/server/utils/site-urls.server'

export async function recoverPasswordRequestRequest({ email }: { email: email_address }) {
  const redirectUrl = (await srvSiteUrls()).full.pages.access.recoverPasswordRequest('/reset')
  priAccess().moodle.iam.v1_0.pri.myAccount.resetPasswordRequest({
    declaredOwnEmail: email,
    redirectUrl,
  })
}
