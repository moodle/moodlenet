'use server'

import { priAccess } from '../../../../lib/server/session-access'
import { srvSiteUrls } from '../../../../lib/server/utils/site-urls.server'

export async function requestAccountSelfDeletion() {
  // TODO: implement safe-action when reason input is added
  const redirectUrl = (await srvSiteUrls()).full.apis.iam.deleteMyAccountRequest.confirm
  priAccess().moodle.iam.pri.myAccount.selfDeletionRequest({ redirectUrl })
  return true
}
