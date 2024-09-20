'use server'

import { getMod } from '../../../../lib/server/session-access'
import { changePasswordForm } from '@moodle/mod-iam/v1_0/types'

export async function changePassword(changePasswordForm: changePasswordForm) {
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
