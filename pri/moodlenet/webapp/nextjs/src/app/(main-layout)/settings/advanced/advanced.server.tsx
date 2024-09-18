'use server'

import { getMod } from '../../../../lib/server/session-access'
import { srvSiteUrls } from '../../../../lib/server/utils/site-urls.server'

export async function requestAccountSelfDeletion() {
  const {
    moodle: {
      iam: {
        v1_0: {
          pri: {
            myAccount: { selfDeletionRequest },
          },
        },
      },
    },
  } = getMod()
  const {
    full: {
      apis: {
        iam: {
          deleteMyAccountRequest: { confirm },
        },
      },
    },
  } = await srvSiteUrls()
  selfDeletionRequest({ redirectUrl: confirm })
  return true
}
