'use server'

import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { sitepaths } from '../../../../../lib/common/utils/sitepaths'
import { defaultSafeActionClient } from '../../../../../lib/server/safe-action'
import { primary } from '../../../../../lib/server/session-access'
import { fetchAllPrimarySchemas } from '@moodle/domain/lib'
import { userProfileId } from '@moodle/module/user-profile'
import { usingTempFile2asset } from '@moodle/module/storage/lib'

export async function getProfileInfoSchema() {
  const {
    userProfile: { updateProfileInfoSchema },
  } = await fetchAllPrimarySchemas({ primary: primary.moodle })
  return updateProfileInfoSchema
}

export const updateProfileInfo = defaultSafeActionClient
  .schema(getProfileInfoSchema)
  .action(async ({ parsedInput: profileInfo }) => {
    const canEditProfile = await fetchCanEditProfile({ userProfileId: profileInfo.userProfileId })
    if (!canEditProfile) {
      returnValidationErrors(getProfileInfoSchema, {
        _errors: [t(`cannot edit this profile info`)],
      })
    }

    const [editDone, editResult] = await primary.moodle.userProfile.editProfile.editProfileInfo({
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

async function fetchCanEditProfile({ userProfileId }: { userProfileId: userProfileId }) {
  const [readUserProfileDone, userProfileRes] = await primary.moodle.userProfile.userProfile.access({
    by: 'userProfileId',
    userProfileId,
  })
  return readUserProfileDone && userProfileRes.accessObject.permissions.editProfile
}

export async function getUseProfileImageSchema() {
  const {
    userProfile: { useProfileImageSchema },
  } = await fetchAllPrimarySchemas({ primary: primary.moodle })
  return useProfileImageSchema
}

export const adoptProfileImage = defaultSafeActionClient
  .schema(getUseProfileImageSchema)
  .action(async ({ parsedInput: useProfileImageForm }) => {
    const [done, usingTempFile] =
      await primary.moodle.userProfile.editProfile.useTempImageAsProfileImage(useProfileImageForm)
    // const userProfileId = myUserProfileRes.accessObject.id
    if (!done) {
      returnValidationErrors(getProfileInfoSchema, {
        _errors: [t(`something went wrong while saving ${useProfileImageForm.as}`) + ` : ${usingTempFile.reason}`],
      })
    }

    revalidatePath(sitepaths.profile[useProfileImageForm.userProfileId]!())

    return usingTempFile2asset(usingTempFile)
  })

