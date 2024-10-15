'use server'

import { userHome } from '@moodle/domain'
import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { sitepaths } from '../../../../../lib/common/utils/sitepaths'
import { defaultSafeActionClient } from '../../../../../lib/server/safe-action'
import { priAccess } from '../../../../../lib/server/session-access'

export async function getUserHomeSchemas() {
  const { configs } = await priAccess().userHome.query.configs()
  return userHome.getUserHomePrimarySchemas(configs.profileInfoPrimaryMsgSchemaConfigs)
}
export async function getProfileInfoSchema() {
  return (await getUserHomeSchemas()).updateProfileInfoSchema
}

export const updateProfileInfo = defaultSafeActionClient
  .schema(getProfileInfoSchema)
  .action(async ({ parsedInput: profileInfo }) => {
    const canEditProfile = await fetchCanEditProfile({ user_home_id: profileInfo.user_home_id })
    if (!canEditProfile) {
      returnValidationErrors(getProfileInfoSchema, {
        _errors: [t(`cannot edit this profile info`)],
      })
    }

    const [editDone, editResult] = await priAccess().userHome.write.editProfileInfo({
      user_home_id: profileInfo.user_home_id,
      profileInfo: profileInfo,
    })
    if (editDone) {
      revalidatePath(sitepaths.profile[profileInfo.user_home_id]!())
      return
    }
    returnValidationErrors(getProfileInfoSchema, {
      _errors: [t(`something went wrong while saving profile info`) + ` : ${editResult.reason}`],
    })
  })

async function fetchCanEditProfile({ user_home_id }: { user_home_id: userHome.user_home_id }) {
  const [readUserHomeDone, userHomeRes] = await priAccess().userHome.query.userHome({
    by: { idOf: 'user_home', user_home_id },
  })
  return readUserHomeDone && userHomeRes.accessObject.permissions.editProfile
}

export async function getUseProfileImageSchema() {
  return (await getUserHomeSchemas()).useProfileImageSchema
}
export const adoptProfileImage = defaultSafeActionClient
  .schema(getUseProfileImageSchema)
  .action(async ({ parsedInput: useProfileImageForm }) => {
    console.log('->', { useProfileImageForm })

    const [done, editResult] =
      await priAccess().userHome.uploads.useImageInProfile(useProfileImageForm)
    // const user_home_id = myUserHomeRes.accessObject.id
    if (!done) {
      returnValidationErrors(getProfileInfoSchema, {
        _errors: [
          t(`something went wrong while saving ${useProfileImageForm.as}`) +
            ` : ${editResult.reason}`,
        ],
      })
    }

    revalidatePath(sitepaths.profile[useProfileImageForm.userHomeId]!())

    return true
  })

