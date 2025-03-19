'use server'

import { defaultSafeActionClient } from '../../../lib/server/safe-action'
import session from '../../../lib/server/session-client'
import { srvSiteRoutes } from '../../../lib/server/utils/site-urls.server'
import { recoverPasswordRequestSchema } from './recover-password-request.common'

export const recoverPasswordRequestAction = defaultSafeActionClient.schema(recoverPasswordRequestSchema).action(async ({ parsedInput: { email } }) => {
  const redirectUrl = (await srvSiteRoutes()).full('/recover-password-request/reset')
  client.proxy.userAccount.unauthenticated.resetPasswordRequest({
    declaredOwnEmail: email,
    redirectUrl,
  })
})
