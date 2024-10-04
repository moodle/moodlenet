'use server'

import { iam } from '@moodle/domain'
import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { redirect } from 'next/navigation'
import { defaultSafeActionClient } from '../../../../lib/server/safe-action'
import { priAccess } from '../../../../lib/server/session-access'
import { srvSiteUrls } from '../../../../lib/server/utils/site-urls.server'

export async function getSignupSchema() {
  const { iamSchemaConfigs } = await priAccess().netWebappNextjs.schemaConfigs.iam()
  const { signupSchema } = await iam.getIamPrimarySchemas(iamSchemaConfigs)
  return signupSchema
}

export const signupAction = defaultSafeActionClient
  .schema(
    async (/* prevSchema https://next-safe-action.dev/docs/define-actions/extend-previous-schemas */) =>
      getSignupSchema(),
  )
  .action(async ({ parsedInput: signupForm }) => {
    const redirectUrl = (await srvSiteUrls()).full.apis.iam.basicAuth.verifySignupEmailToken

    const [done, resp] = await priAccess().iam.access.signupRequest({
      signupForm,
      redirectUrl,
    })

    if (done) {
      redirect('/')
    }

    returnValidationErrors(getSignupSchema, {
      email: {
        _errors: [
          resp.reason === 'userWithSameEmailExists'
            ? t('User with this email already exists')
            : t('Signup failed for unknown reasons'),
        ],
      },
    })
  })
