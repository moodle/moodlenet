'use server'

import session from '../../../../lib/server/session-client'
import { srvSiteRoutes } from '../../../../lib/server/utils/site-urls.server'

export async function requestAccountSelfDeletion() {
  // FUTURE: implement safe-action when/if reason input is added
  const redirectUrl = (await srvSiteRoutes()).full('/-/api/userAccount/delete-my-account-request/confirm')
  client.proxy.userAccount.authenticated.selfDeletionRequest({ redirectUrl })
  return true
}
