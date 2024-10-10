'use server'

import { iam } from '@moodle/domain'
import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { defaultSafeActionClient } from '../../../../lib/server/safe-action'
import { priAccess } from '../../../../lib/server/session-access'

export async function getResetMyPasswordSchema() {
  const { iamSchemaConfigs } = await priAccess().netWebappNextjs.schemaConfigs.iam()
  const { resetPasswordSchema } = await iam.getIamPrimarySchemas(iamSchemaConfigs)
  return resetPasswordSchema
}
export const resetMyPasswordAction = defaultSafeActionClient
  .schema(getResetMyPasswordSchema)
  .action(async ({ parsedInput: resetPasswordForm }) => {
    const [ok, resp] = await priAccess().iam.myAccount.resetPassword({
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
