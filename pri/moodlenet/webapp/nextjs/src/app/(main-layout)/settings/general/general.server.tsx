'use server'

import { lib_moodle_iam } from '@moodle/lib-domain'
import { getMod } from '../../../../lib/server/session-access'

export async function changePassword(changePasswordForm: lib_moodle_iam.v1_0.changePasswordForm) {
  const {
    moodle: {
      iam: {
        v1_0: {
          pri: {
            myAccount: { changePassword },
          },
        },
      },
    },
  } = getMod()
  const [done, result] = await changePassword(changePasswordForm)
  return [done, result]
}
