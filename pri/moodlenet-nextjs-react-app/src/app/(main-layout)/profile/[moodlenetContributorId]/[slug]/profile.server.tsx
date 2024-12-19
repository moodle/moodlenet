'use server'

import { fetchAllPrimarySchemas } from '@moodle/domain/lib'
import { adoptAssetService } from '@moodle/module/storage'
import { profileImageType } from '@moodle/module/user-profile'
import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { appRoutes } from '../../../../../lib/common/appRoutes'
import { defaultSafeActionClient, safeActionResult_to_adoptAssetResult } from '../../../../../lib/server/safe-action'
import { access } from '../../../../../lib/server/session-access'

export async function getEditProfileInfoSchema() {
  const {
    userProfile: { editProfileInfoMetaSchema },
  } = await fetchAllPrimarySchemas({ primary: access.primary })
  return editProfileInfoMetaSchema
}

export const updateMyProfileInfoMetaForm = defaultSafeActionClient
  .schema(getEditProfileInfoSchema)
  .action(async ({ parsedInput: profileInfoMeta }) => {
    const [editDone, editResult] = await access.primary.userProfile.authenticated.editProfileInfoMeta({
      profileInfoMeta,
    })
    if (editDone) {
      revalidatePath(appRoutes(`/profile/${editResult.userProfileId}/`))
      return
    }
    returnValidationErrors(getEditProfileInfoSchema, {
      _errors: [t(`something went wrong while saving profile info`) + ` : ${editResult.reason}`],
    })
  })

export async function getUseProfileImageSchema() {
  const {
    userProfile: { useProfileImageSchema },
  } = await fetchAllPrimarySchemas({ primary: access.primary })
  return useProfileImageSchema
}

export async function getApplyMyProfileImageadoptAssetService(type: profileImageType): Promise<adoptAssetService> {
  return async function adoptAssetForm_myProfileImage(adoptAssetForm) {
    'use server'
    const applyMyProfileImageAction = defaultSafeActionClient
      .schema(getUseProfileImageSchema)
      .action(async ({ parsedInput: { type, adoptAssetForm } }) => {
        return access.primary.userProfile.authenticated
          .useTempImageAsProfileImage({ useProfileImageForm: { type, adoptAssetForm } })
          .then(({ adoptAssetResult, userProfileId }) => {
            revalidatePath(appRoutes(`/profile/${userProfileId}/`))
            return adoptAssetResult
          })
      })
    return safeActionResult_to_adoptAssetResult(applyMyProfileImageAction({ type, adoptAssetForm }))
  }
}
