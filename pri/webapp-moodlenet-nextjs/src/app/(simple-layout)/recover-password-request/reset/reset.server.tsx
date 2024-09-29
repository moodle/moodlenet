'use server'

import { getIamPrimarySchemas } from '@moodle/mod-iam/lib'
import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { actionClient } from '../../../../lib/server/safe-action'
import { priAccess } from '../../../../lib/server/session-access'

export async function getResetMyPasswordSchema() {
  const { iamSchemaConfigs } = await priAccess().moodle.netWebappNextjs.pri.schemaConfigs.iam()
  const { resetPasswordSchema } = await getIamPrimarySchemas(iamSchemaConfigs)
  return resetPasswordSchema
}
export const resetMyPasswordAction = actionClient
  .schema(getResetMyPasswordSchema)
  .action(async ({ parsedInput: resetPasswordForm }) => {
    const [ok, resp] = await priAccess().moodle.iam.pri.myAccount.resetPassword({
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
