'use server'

import { priAccess } from '../../../../lib/server/session-access'
import { changePasswordForm } from '@moodle/mod-iam/v1_0/types'

export async function changePassword(changePasswordForm: changePasswordForm) {
  const [done, result] =
    await priAccess().moodle.iam.v1_0.pri.myAccount.changePassword(changePasswordForm)
  return [done, result]
}
