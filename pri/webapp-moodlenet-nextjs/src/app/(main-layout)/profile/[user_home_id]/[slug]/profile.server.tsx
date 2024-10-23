'use server'

import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { sitepaths } from '../../../../../lib/common/utils/sitepaths'
import { defaultSafeActionClient } from '../../../../../lib/server/safe-action'
import { primary } from '../../../../../lib/server/session-access'
import { fetchAllPrimarySchemas } from '@moodle/domain/lib'
import { user_home_id } from '@moodle/module/user-home'
import { usingTempFile2asset } from '@moodle/module/storage/lib'

export async function getProfileInfoSchema() {
  const {
    userHome: { updateProfileInfoSchema },
  } = await fetchAllPrimarySchemas({ primary: primary.moodle })
  return updateProfileInfoSchema
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

    const [editDone, editResult] = await primary.moodle.userHome.editProfile.editProfileInfo({
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

async function fetchCanEditProfile({ user_home_id }: { user_home_id: user_home_id }) {
  const [readUserHomeDone, userHomeRes] = await primary.moodle.userHome.userHome.access({
    by: { idOf: 'user_home', user_home_id },
  })
  return readUserHomeDone && userHomeRes.accessObject.permissions.editProfile
}

export async function getUseProfileImageSchema() {
  const {
    userHome: { useProfileImageSchema },
  } = await fetchAllPrimarySchemas({ primary: primary.moodle })
  return useProfileImageSchema
}

export const adoptProfileImage = defaultSafeActionClient
  .schema(getUseProfileImageSchema)
  .action(async ({ parsedInput: useProfileImageForm }) => {
    console.log('->', { useProfileImageForm })

    const [done, usingTempFile] = await primary.moodle.userHome.editProfile.useTempImageAsProfileImage(useProfileImageForm)
    // const user_home_id = myUserHomeRes.accessObject.id
    if (!done) {
      returnValidationErrors(getProfileInfoSchema, {
        _errors: [t(`something went wrong while saving ${useProfileImageForm.as}`) + ` : ${usingTempFile.reason}`],
      })
    }

    revalidatePath(sitepaths.profile[useProfileImageForm.userHomeId]!())

    return usingTempFile2asset(usingTempFile)
  })

