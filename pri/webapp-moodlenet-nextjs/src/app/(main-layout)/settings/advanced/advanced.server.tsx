'use server'

import { primary } from '../../../../lib/server/session-access'
import { srvSiteUrls } from '../../../../lib/server/utils/site-urls.server'

export async function requestAccountSelfDeletion() {
  // TODO: implement safe-action when reason input is added
  const redirectUrl = (await srvSiteUrls()).full['-'].api.iam['delete-my-account-request'].confirm()
  primary.moodle.iam.myAccount.selfDeletionRequest({ redirectUrl })
  return true
}
