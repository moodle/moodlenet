'use server'

import { actionClient } from '../../../lib/server/safe-action'
import { priAccess } from '../../../lib/server/session-access'
import { srvSiteUrls } from '../../../lib/server/utils/site-urls.server'
import { recoverPasswordRequestSchema } from './recover-password-request.common'

export const recoverPasswordRequestAction = actionClient
  .schema(recoverPasswordRequestSchema)
  .action(async ({ parsedInput: { email } }) => {
    const redirectUrl = (await srvSiteUrls()).full.pages.access.recoverPasswordRequest('/reset')
    priAccess().moodle.iam.v1_0.pri.myAccount.resetPasswordRequest({
      declaredOwnEmail: email,
      redirectUrl,
    })
  })
