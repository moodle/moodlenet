'use server'

import { getUserHomePrimarySchemas } from 'domain/src/user-hone'
import { priAccess } from '../../../lib/server/session-access'
import { defaultSafeActionClient } from '../../../lib/server/safe-action'
import { revalidatePath } from 'next/cache'
import { returnValidationErrors } from 'next-safe-action/.'
import { t } from 'i18next'
import { sitepaths } from '../../../lib/common/utils/sitepaths'

export async function getProfileInfoSchema() {
  const { configs } = await priAccess().userHome.myHome.configs()
  return getUserHomePrimarySchemas(configs.userHomePrimaryMsgSchemaConfigs).updateProfileInfoSchema
}

export const updateProfileInfo = defaultSafeActionClient
  .schema(getProfileInfoSchema)
  .action(async ({ parsedInput: profileInfo }) => {
    const [done] = await priAccess().userHome.myHome.editMyProfileInfo({ profileInfo })
    if (done) {
      revalidatePath(sitepaths().pages.homepages.profile(profileInfo.user_home_id)(''))
      return
    }
    returnValidationErrors(getProfileInfoSchema, {
      _errors: [t(`something went wrong while saving profile info`)],
    })
  })
