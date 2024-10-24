'use server'

import { defaultSafeActionClient } from '../../../lib/server/safe-action'
import { access } from '../../../lib/server/session-access'
import { srvSiteUrls } from '../../../lib/server/utils/site-urls.server'
import { recoverPasswordRequestSchema } from './recover-password-request.common'

export const recoverPasswordRequestAction = defaultSafeActionClient
  .schema(recoverPasswordRequestSchema)
  .action(async ({ parsedInput: { email } }) => {
    const redirectUrl = (await srvSiteUrls()).full['recover-password-request'].reset()
    access.primary.userAccount.access.resetPasswordRequest({
      declaredOwnEmail: email,
      redirectUrl,
    })
  })
