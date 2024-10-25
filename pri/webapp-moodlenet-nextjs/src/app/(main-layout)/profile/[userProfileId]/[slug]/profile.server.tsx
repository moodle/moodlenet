'use server'

import { fetchAllPrimarySchemas } from '@moodle/domain/lib'
import { usingTempFile2asset } from '@moodle/module/storage/lib'
import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { sitepaths } from '../../../../../lib/common/utils/sitepaths'
import { defaultSafeActionClient } from '../../../../../lib/server/safe-action'
import { access } from '../../../../../lib/server/session-access'

export async function getProfileInfoSchema() {
  const {
    userProfile: { updateProfileInfoSchema },
  } = await fetchAllPrimarySchemas({ primary: access.primary })
  return updateProfileInfoSchema
}

export const updateProfileInfo = defaultSafeActionClient
  .schema(getProfileInfoSchema)
  .action(async ({ parsedInput: profileInfo }) => {
    const [editDone, editResult] = await access.primary.userProfile.editProfile.editProfileInfo({
      userProfileId: profileInfo.userProfileId,
      profileInfo: profileInfo,
    })
    if (editDone) {
      revalidatePath(sitepaths.profile[profileInfo.userProfileId]!())
      return
    }
    returnValidationErrors(getProfileInfoSchema, {
      _errors: [t(`something went wrong while saving profile info`) + ` : ${editResult.reason}`],
    })
  })


export async function getUseProfileImageSchema() {
  const {
    userProfile: { useProfileImageSchema },
  } = await fetchAllPrimarySchemas({ primary: access.primary })
  return useProfileImageSchema
}

export const adoptProfileImage = defaultSafeActionClient
  .schema(getUseProfileImageSchema)
  .action(async ({ parsedInput: useProfileImageForm }) => {
    const [done, usingTempFile] =
      await access.primary.userProfile.editProfile.useTempImageAsProfileImage(useProfileImageForm)
    // const userProfileId = myUserProfileRes.accessObject.id
    if (!done) {
      returnValidationErrors(getProfileInfoSchema, {
        _errors: [t(`something went wrong while saving ${useProfileImageForm.as}`) + ` : ${usingTempFile.reason}`],
      })
    }

    revalidatePath(sitepaths.profile[useProfileImageForm.userProfileId]!())

    return usingTempFile2asset(usingTempFile)
  })

