'use server'

import { defaultSafeActionClient } from '../../../lib/server/safe-action'
import { access } from '../../../lib/server/session-access'
import { srvSiteRoutes } from '../../../lib/server/utils/site-urls.server'
import { recoverPasswordRequestSchema } from './recover-password-request.common'

export const recoverPasswordRequestAction = defaultSafeActionClient
  .schema(recoverPasswordRequestSchema)
  .action(async ({ parsedInput: { email } }) => {
    const redirectUrl = (await srvSiteRoutes()).full('/recover-password-request/reset')
    access.primary.userAccount.unauthenticated.resetPasswordRequest({
      declaredOwnEmail: email,
      redirectUrl,
    })
  })
