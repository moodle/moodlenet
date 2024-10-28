'use server'

import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import QueryString from 'qs'
import { sitepaths } from '../../../../lib/common/utils/sitepaths'
import { setAuthTokenCookie } from '../../../../lib/server/auth'
import { defaultSafeActionClient } from '../../../../lib/server/safe-action'
import { access } from '../../../../lib/server/session-access'
import { getAllPrimarySchemas } from '../../../../lib/server/primarySchemas'

export async function getLoginSchema() {
  const allSchemas = await getAllPrimarySchemas()
  return allSchemas.userAccount.loginSchema
}
export const loginAction = defaultSafeActionClient.schema(getLoginSchema).action(async ({ parsedInput: loginForm }) => {
  // const inSiteRefererUrl = await getInSiteReferer()

  const xSearchHeader = headers().get('x-search')
  const redirectPathAfterLogin = xSearchHeader ? String(QueryString.parse(xSearchHeader).redirect) : undefined

  const redirectUrl = redirectPathAfterLogin || sitepaths()

  const [loginSuccess, loginResponse] = await access.primary.userAccount.unauthenticated.login({
    loginForm,
  })
  if (!loginSuccess) {
    returnValidationErrors(getLoginSchema, { _errors: [t('Incorrect email or password')] })
  }
  setAuthTokenCookie(loginResponse.sessionToken)
  revalidatePath('/', 'layout')
  redirect(redirectUrl)
})
