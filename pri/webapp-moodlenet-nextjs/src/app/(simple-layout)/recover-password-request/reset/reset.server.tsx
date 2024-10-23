'use server'

import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { defaultSafeActionClient } from '../../../../lib/server/safe-action'
import { primary } from '../../../../lib/server/session-access'
import { getAllPrimarySchemas } from '../../../../lib/server/primarySchemas'

export async function getResetMyPasswordSchema() {
  const { userAccount } = await getAllPrimarySchemas()
  return userAccount.resetPasswordSchema
}
export const resetMyPasswordAction = defaultSafeActionClient
  .schema(getResetMyPasswordSchema)
  .action(async ({ parsedInput: resetPasswordForm }) => {
    const [ok, resp] = await primary.moodle.userAccount.myAccount.resetPassword({
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
