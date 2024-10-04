'use server'

import { getProfileInfoPrimarySchemas } from 'domain/src/user-hone'
import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { sitepaths } from '../../../../../lib/common/utils/sitepaths'
import { defaultSafeActionClient } from '../../../../../lib/server/safe-action'
import { priAccess } from '../../../../../lib/server/session-access'

export async function getProfileInfoSchema() {
  const { configs } = await priAccess().userHome.read.configs()
  return getProfileInfoPrimarySchemas(configs.profileInfoPrimaryMsgSchemaConfigs)
    .updateProfileInfoSchema
}

export const updateProfileInfo = defaultSafeActionClient
  .schema(getProfileInfoSchema)
  .action(async ({ parsedInput: profileInfo }) => {
    const [readUserHomeDone, userHomeRes] = await priAccess().userHome.read.userHome({
      by: { idOf: 'user_home', user_home_id: profileInfo.user_home_id },
    })
    if (!readUserHomeDone || !userHomeRes.accessObject.permissions.editProfile) {
      returnValidationErrors(getProfileInfoSchema, {
        _errors: [t(`cannot edit this profile info`)],
      })
    }
    const [editDone, editResult] = await priAccess().userHome.write.editProfileInfo({
      user_home_id: profileInfo.user_home_id,
      profileInfo: profileInfo,
    })
    if (editDone) {
      revalidatePath(sitepaths().pages.homepages.profile(profileInfo.user_home_id)(''))
      return
    }
    returnValidationErrors(getProfileInfoSchema, {
      _errors: [t(`something went wrong while saving profile info`) + ` : ${editResult.reason}`],
    })
  })
