'use server'

import { redirect } from 'next/navigation'
import { priAccess } from '../../../../lib/server/session-access'
import { setAuthTokenCookie } from '../../../../lib/server/auth'
import { revalidatePath } from 'next/cache'
import { fetchPrimarySchemas } from '@moodle/mod-iam/v1_0/lib'
import { actionClient } from '../../../../lib/server/safe-action'
import { returnValidationErrors } from 'next-safe-action'
import { t } from 'i18next'
import QueryString from 'qs'
import { headers } from 'next/headers'
import { srvSiteUrls } from '../../../../lib/server/utils/site-urls.server'

export async function getLoginSchema() {
  const { loginSchema } = await fetchPrimarySchemas(priAccess())
  return loginSchema
}
export const loginAction = actionClient
  .schema(getLoginSchema)
  .action(async ({ parsedInput: loginForm }) => {
    const xSearchHeader = headers().get('x-search') ?? ''
    const parsedQs = QueryString.parse(xSearchHeader)
    console.log({ xSearchHeader, parsedQs })
    const redirectUrl = parsedQs.redirect ?? (await srvSiteUrls()).site.pages.landing

    const [loginSuccess, loginResponse] = await priAccess().moodle.iam.v1_0.pri.access.login({
      loginForm,
    })
    if (!loginSuccess) {
      returnValidationErrors(getLoginSchema, { _errors: [t('Incorrect email or password')] })
    }
    setAuthTokenCookie(loginResponse.session)
    revalidatePath('/', 'layout')
    redirect(`${redirectUrl}`)
  })
