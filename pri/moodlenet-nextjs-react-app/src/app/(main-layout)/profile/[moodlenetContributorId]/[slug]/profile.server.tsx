'use server'

import { fetchAllPrimarySchemas } from '@moodle/domain/lib'
import { usingTempFile2asset } from '@moodle/module/storage/lib'
import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { appRoutes } from '../../../../../lib/common/appRoutes'
import { defaultSafeActionClient } from '../../../../../lib/server/safe-action'
import { access } from '../../../../../lib/server/session-access'

export async function getProfileInfoSchema() {
  const {
    userProfile: { updateProfileInfoMetaSchema },
  } = await fetchAllPrimarySchemas({ primary: access.primary })
  return updateProfileInfoMetaSchema
}

export const updateMyProfileInfoMetaForm = defaultSafeActionClient
  .schema(getProfileInfoSchema)
  .action(async ({ parsedInput: partialProfileInfoMeta }) => {
    const [editDone, editResult] = await access.primary.userProfile.authenticated.editProfileInfoMeta({
      partialProfileInfoMeta,
    })
    if (editDone) {
      revalidatePath(appRoutes(`/profile/${editResult.userProfileId}/`))
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

export const adoptMyProfileImage = defaultSafeActionClient
  .schema(getUseProfileImageSchema)
  .action(async ({ parsedInput: useProfileImageForm }) => {
    const [[done, result], { userProfileId }] =
      await access.primary.userProfile.authenticated.useTempImageAsProfileImage(useProfileImageForm)
    if (!done) {
      returnValidationErrors(getProfileInfoSchema, {
        _errors: [t(`something went wrong while saving ${useProfileImageForm.as}`) + ` : ${result.reason}`],
      })
    }

    revalidatePath(appRoutes(`/profile/${userProfileId}/`))

    return usingTempFile2asset(result)
  })
