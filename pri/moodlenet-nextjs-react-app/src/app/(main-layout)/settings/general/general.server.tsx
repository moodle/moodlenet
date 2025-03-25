'use server'

import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { getAllPrimarySchemas } from '../../../../lib/server/primarySchemas'
import { defaultSafeActionClient } from '../../../../lib/server/safe-action'
import session from '../../../../lib/server/session-client'

async function getChangePasswordSchema() {
  const { userAccount } = await getAllPrimarySchemas()
  return userAccount.changePasswordSchema /* .superRefine(({ currentPassword, newPassword }, ctx) => {
    if (currentPassword.redacted === newPassword.redacted) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords must be different',
        path: ['newPassword.redacted'],
      })
    }
  }) */
}

export const changePasswordAction = defaultSafeActionClient.schema(getChangePasswordSchema).action(async ({ parsedInput: changePasswordForm }) => {
  const [done, result] = await client.proxy.userAccount.authenticated.changePassword(changePasswordForm)
  if (!done) {
    returnValidationErrors(getChangePasswordSchema, {
      _errors:
        result.reason === 'wrongCurrentPassword'
          ? [t('Failed to change your password, ensure you entered your current password correctly')]
          : /* result.reason==='unknown'? */ [t('Something went wrong while changing the password')],
    })
  }
})
