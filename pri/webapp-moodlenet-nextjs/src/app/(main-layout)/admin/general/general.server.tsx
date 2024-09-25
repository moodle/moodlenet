'use server'

import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { actionClient } from '../../../../lib/server/safe-action'
import { priAccess } from '../../../../lib/server/session-access'
import { MakeAdminGeneralSchemaDeps, provideAdminGeneralSchemas } from './general.common'
import { revalidatePath } from 'next/cache'

export async function getAdminGeneralSchemas() {
  const { moodleNetSchemaConfigs, orgSchemaConfigs } = await fetchMakeAdminGeneralSchemaDeps()
  return provideAdminGeneralSchemas({ moodleNetSchemaConfigs, orgSchemaConfigs })
}
async function getGeneralSchema() {
  const { generalSchema: general } = await getAdminGeneralSchemas()
  return general
}
export const saveGeneralInfoAction = actionClient
  .schema(getGeneralSchema)
  .action(async ({ parsedInput: adminGeneralForm }) => {
    const { moodleNetInfoSchema, orgInfoSchema } = await getAdminGeneralSchemas()

    const [[mnetDone], [orgDone]] = await Promise.all([
      priAccess().moodle.net.v1_0.pri.admin.updatePartialMoodleNetInfo({
        partialInfo: moodleNetInfoSchema.parse(adminGeneralForm),
      }),
      priAccess().moodle.org.v1_0.pri.admin.updatePartialOrgInfo({
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

export async function fetchMakeAdminGeneralSchemaDeps(): Promise<MakeAdminGeneralSchemaDeps> {
  const [{ moodleNetSchemaConfigs }, { orgSchemaConfigs }] = await Promise.all([
    priAccess().moodle.netWebappNextjs.v1_0.pri.schemaConfigs.moodleNet(),
    priAccess().moodle.netWebappNextjs.v1_0.pri.schemaConfigs.org(),
  ])
  return { moodleNetSchemaConfigs, orgSchemaConfigs }
}

