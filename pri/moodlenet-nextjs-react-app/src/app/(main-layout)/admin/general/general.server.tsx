'use server'

import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { getAllPrimarySchemas } from '../../../../lib/server/primarySchemas'
import { defaultSafeActionClient } from '../../../../lib/server/safe-action'
import session from '../../../../lib/server/session-client'
import { provideAdminGeneralSchemas } from './general.common'

export async function getAdminGeneralSchemas() {
  return provideAdminGeneralSchemas(await getAllPrimarySchemas())
}
async function getGeneralSchema() {
  const { generalSchema: general } = await getAdminGeneralSchemas()
  return general
}
export const saveGeneralInfoAction = defaultSafeActionClient.schema(getGeneralSchema).action(async ({ parsedInput: adminGeneralForm }) => {
  const { moodlenetInfoSchema, orgInfoSchema } = await getAdminGeneralSchemas()

  const [[moodlenetDone], [orgDone]] = await Promise.all([
    client.proxy.moodlenet.admin.updatePartialMoodlenetInfo({
      partialInfo: moodlenetInfoSchema.parse(adminGeneralForm),
    }),
    client.proxy.org.admin.updatePartialOrgInfo({
      partialInfo: orgInfoSchema.parse(adminGeneralForm),
    }),
  ])
  if (!(moodlenetDone && orgDone)) {
    return returnValidationErrors(getGeneralSchema, {
      _errors: [t(`something went wrong while saving the general info`)],
    })
  }
  revalidatePath('/', 'layout')
})
