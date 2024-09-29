'use server'

import { getIamPrimarySchemas } from '@moodle/mod-iam/lib'
import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import QueryString from 'qs'
import { sitepaths } from '../../../../lib/common/utils/sitepaths'
import { setAuthTokenCookie } from '../../../../lib/server/auth'
import { actionClient } from '../../../../lib/server/safe-action'
import { priAccess } from '../../../../lib/server/session-access'

export async function getLoginSchema() {
  const { iamSchemaConfigs } = await priAccess().moodle.netWebappNextjs.pri.schemaConfigs.iam()
  const { loginSchema } = await getIamPrimarySchemas(iamSchemaConfigs)
  return loginSchema
}
export const loginAction = actionClient
  .schema(getLoginSchema)
  .action(async ({ parsedInput: loginForm }) => {
    // const inSiteRefererUrl = await getInSiteReferer()

    const xSearchHeader = headers().get('x-search')
    const searchRedirectPath = xSearchHeader
      ? String(QueryString.parse(xSearchHeader).redirect)
      : undefined

    const redirectUrl = searchRedirectPath || sitepaths().pages.landing

    const [loginSuccess, loginResponse] = await priAccess().moodle.iam.pri.access.login({
      loginForm,
    })
    if (!loginSuccess) {
      returnValidationErrors(getLoginSchema, { _errors: [t('Incorrect email or password')] })
    }
    setAuthTokenCookie(loginResponse.session)
    revalidatePath('/', 'layout')
    redirect(redirectUrl)
  })
