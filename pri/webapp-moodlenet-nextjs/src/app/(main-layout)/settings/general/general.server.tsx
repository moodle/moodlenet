'use server'

import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { getAllPrimarySchemas } from '../../../../lib/server/primarySchemas'
import { defaultSafeActionClient } from '../../../../lib/server/safe-action'
import { priAccess } from '../../../../lib/server/session-access'

async function getChangePasswordSchema() {
  const { iam } = await getAllPrimarySchemas()
  return iam.changePasswordSchema /* .superRefine(({ currentPassword, newPassword }, ctx) => {
    if (currentPassword.__redacted__ === newPassword.__redacted__) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords must be different',
        path: ['newPassword.__redacted__'],
      })
    }
  }) */
}

export const changePasswordAction = defaultSafeActionClient
  .schema(getChangePasswordSchema)
  .action(async ({ parsedInput: changePasswordForm }) => {
    const [done, result] = await priAccess().iam.myAccount.changePassword(changePasswordForm)
    if (!done) {
      returnValidationErrors(getChangePasswordSchema, {
        _errors:
          result.reason === 'wrongCurrentPassword'
            ? [
                t(
                  'Failed to change your password, ensure you entered your current password correctly',
                ),
              ]
            : /* result.reason==='unknown'? */ [
                t('Something went wrong while changing the password'),
              ],
      })
    }
  })
