'use server'

import { resetPasswordForm } from '@moodle/mod-iam/v1_0/types'
import { getMod } from '../../../../lib/server/session-access'
import { srvSiteUrls } from '../../../../lib/server/utils/site-urls.server'
import { domain, reply_of } from '@moodle/lib-ddd'

export async function resetMyPassword({
  resetPasswordToken,
  resetPasswordForm,
}: {
  resetPasswordForm: resetPasswordForm
  resetPasswordToken: string
}): Promise<reply_of<typeof domain.moodle.iam.v1_0.pri.myAccount.resetPassword>> {
  const redirectUrl = await (await srvSiteUrls()).full.pages.landing
  const reply = await getMod().moodle.iam.v1_0.pri.myAccount.resetPassword({
    resetPasswordToken,
    resetPasswordForm,
  })
  return reply
}
