'use server'

import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { redirect } from 'next/navigation'
import { getAllPrimarySchemas } from '../../../../lib/server/primarySchemas'
import { defaultSafeActionClient } from '../../../../lib/server/safe-action'
import { access } from '../../../../lib/server/session-access'
import { srvSiteUrls } from '../../../../lib/server/utils/site-urls.server'

export async function getSignupSchema() {
  const allSchemas = await getAllPrimarySchemas()
  return allSchemas.userAccount.signupSchema
}

export const signupAction = defaultSafeActionClient
  .schema(async (/* prevSchema https://next-safe-action.dev/docs/define-actions/extend-previous-schemas */) =>
    getSignupSchema(),)
  .action(async ({ parsedInput: signupForm }) => {
    const redirectUrl = (await srvSiteUrls()).full['-'].api.userAccount['basic-auth']['verify-signup-email-token']()

    const [done, resp] = await access.primary.userAccount.access.signupRequest({
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
