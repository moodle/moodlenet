'use server'

import { fetchAllPrimarySchemas } from '@moodle/domain/lib'
import { adoptAssetService } from '@moodle/module/content'
import { profileImageType } from '@moodle/module/user-profile'
import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { appRoutes } from '../../../../../lib/common/appRoutes'
import { defaultSafeActionClient, safeActionResult_to_adoptAssetResponse } from '../../../../../lib/server/safe-action'
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

export async function getApplyMyProfileImageadoptAssetService(as: profileImageType): Promise<adoptAssetService> {
  return async function adoptAssetForm_myProfileImage(adoptAssetForm) {
    'use server'
    const applyMyProfileImageAction = defaultSafeActionClient
      .schema(getUseProfileImageSchema)
      .action(async ({ parsedInput: { as, adoptAssetForm } }) => {
        return access.primary.userProfile.authenticated
          .useTempImageAsProfileImage({ useProfileImageForm: { as, adoptAssetForm } })
          .then(({ adoptAssetResponse, userProfileId }) => {
            revalidatePath(appRoutes(`/profile/${userProfileId}/`))
            return adoptAssetResponse
          })
      })
    return safeActionResult_to_adoptAssetResponse(applyMyProfileImageAction({ as, adoptAssetForm }))
  }
}
