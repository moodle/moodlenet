'use server'

import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { getAllPrimarySchemas } from '../../../../lib/server/primarySchemas'
import { defaultSafeActionClient } from '../../../../lib/server/safe-action'
import { priAccess } from '../../../../lib/server/session-access'
import { provideAdminGeneralSchemas } from './general.common'

export async function getAdminGeneralSchemas() {
  return provideAdminGeneralSchemas(await getAllPrimarySchemas())
}
async function getGeneralSchema() {
  const { generalSchema: general } = await getAdminGeneralSchemas()
  return general
}
export const saveGeneralInfoAction = defaultSafeActionClient
  .schema(getGeneralSchema)
  .action(async ({ parsedInput: adminGeneralForm }) => {
    const { moodleNetInfoSchema, orgInfoSchema } = await getAdminGeneralSchemas()

    const [[mnetDone], [orgDone]] = await Promise.all([
      priAccess().net.admin.updatePartialMoodleNetInfo({
        partialInfo: moodleNetInfoSchema.parse(adminGeneralForm),
      }),
      priAccess().org.admin.updatePartialOrgInfo({
        partialInfo: orgInfoSchema.parse(adminGeneralForm),
      }),
    ])
    revalidatePath('/')
    if (mnetDone && orgDone) {
      return
    }
    returnValidationErrors(getGeneralSchema, {
      _errors: [t(`something went wrong while saving the general info`)],
    })
  })
