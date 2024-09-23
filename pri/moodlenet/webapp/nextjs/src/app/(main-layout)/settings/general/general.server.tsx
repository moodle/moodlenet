'use server'

import { fetchPrimarySchemas } from '@moodle/mod-iam/v1_0/lib'
import { priAccess } from '../../../../lib/server/session-access'
import { actionClient } from '../../../../lib/server/safe-action'
import { returnValidationErrors } from 'next-safe-action'
import { t } from 'i18next'

async function getChangePasswordSchema() {
  const { changePasswordSchema } = await fetchPrimarySchemas(priAccess())
  return changePasswordSchema.superRefine(({ currentPassword, newPassword }, ctx) => {
    if (currentPassword.__redacted__ === newPassword.__redacted__) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords must be different',
        path: ['newPassword.__redacted__'],
      })
    }
  })
}

export const changePasswordAction = actionClient
  .schema(getChangePasswordSchema)
  .action(async ({ parsedInput: changePasswordForm }) => {
    const [done, result] =
      await priAccess().moodle.iam.v1_0.pri.myAccount.changePassword(changePasswordForm)
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
