'use server'

import { redirect } from 'next/navigation'
import { priAccess } from '../../../../lib/server/session-access'
import { srvSiteUrls } from '../../../../lib/server/utils/site-urls.server'
import { actionClient } from '../../../../lib/server/safe-action'
import { fetchPrimarySchemas } from '@moodle/mod-iam/v1_0/lib'
import { returnValidationErrors } from 'next-safe-action'
import { t } from 'i18next'

export async function getSignupSchema() {
  const { signupSchema } = await fetchPrimarySchemas(priAccess())
  return signupSchema
}

export const signupAction = actionClient
  .schema(
    async (/* prevSchema https://next-safe-action.dev/docs/define-actions/extend-previous-schemas */) =>
      getSignupSchema(),
  )
  .action(async ({ parsedInput: signupForm }) => {
    const redirectUrl = (await srvSiteUrls()).full.apis.iam.basicAuth.verifySignupEmailToken

    const [done, resp] = await priAccess().moodle.iam.v1_0.pri.access.request({
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

