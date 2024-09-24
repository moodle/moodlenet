'use server'

import { priAccess } from '../../../../lib/server/session-access'
import { actionClient } from '../../../../lib/server/safe-action'
import { fetchPrimarySchemas } from '@moodle/mod-iam/v1_0/lib'
import { returnValidationErrors } from 'next-safe-action'
import { t } from 'i18next'

export async function getResetMyPasswordSchema() {
  const { resetPasswordSchema } = await fetchPrimarySchemas(priAccess())
  return resetPasswordSchema
}
export const resetMyPasswordAction = actionClient
  .schema(getResetMyPasswordSchema)
  .action(async ({ parsedInput: resetPasswordForm }) => {
    const [ok, resp] = await priAccess().moodle.iam.v1_0.pri.myAccount.resetPassword({
      resetPasswordForm,
    })
    if (!ok) {
      returnValidationErrors(getResetMyPasswordSchema, {
        _errors: [
          resp.reason === 'invalidToken' || resp.reason === 'userNotFound'
            ? t('The password reset link is invalid. Please request a new one.')
            : t('An error occurred while resetting your password. Please try again.'),
        ],
      })
    }
  })
