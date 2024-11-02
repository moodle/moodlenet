'use server'

import { access } from '../../../../lib/server/session-access'
import { srvSiteRoutes } from '../../../../lib/server/utils/site-urls.server'

export async function requestAccountSelfDeletion() {
  // TODO: implement safe-action when reason input is added
  const redirectUrl = (await srvSiteRoutes()).full('/-/api/userAccount/delete-my-account-request/confirm')
  access.primary.userAccount.authenticated.selfDeletionRequest({ redirectUrl })
  return true
}
