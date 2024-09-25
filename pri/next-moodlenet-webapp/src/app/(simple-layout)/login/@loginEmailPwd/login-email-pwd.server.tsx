'use server'

import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import QueryString from 'qs'
import { setAuthTokenCookie } from '../../../../lib/server/auth'
import { actionClient } from '../../../../lib/server/safe-action'
import { priAccess } from '../../../../lib/server/session-access'
import { srvSiteUrls } from '../../../../lib/server/utils/site-urls.server'
import { getPrimarySchemas } from '@moodle/mod-iam/v1_0/lib'

export async function getLoginSchema() {
  const { iamSchemaConfigs } = await priAccess().moodle.netWebappNextjs.v1_0.pri.schemaConfigs.iam()
  const { loginSchema } = await getPrimarySchemas(iamSchemaConfigs)
  return loginSchema
}
export const loginAction = actionClient
  .schema(getLoginSchema)
  .action(async ({ parsedInput: loginForm }) => {
    const xSearchHeader = headers().get('x-search') ?? ''
    const parsedQs = QueryString.parse(xSearchHeader)
    // console.log({ xSearchHeader, parsedQs })
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
