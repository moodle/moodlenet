'use server'

import { fetchAllPrimarySchemas } from '@moodle/domain/lib'
import { profileImageType, userProfileId } from '@moodle/module/user-profile'
import { revalidatePath } from 'next/cache'
import { adoptValuedAssetSafeAction } from '../../../../../lib/common/actions'
import { appRoutes } from '../../../../../lib/common/appRoutes'
import { defaultSafeActionClient } from '../../../../../lib/server/safe-action'
import session from '../../../../../lib/server/session-client'
import { updateMyProfileInfoSafeAction } from '../../../../../ui/pages/Profile/ProfilePage'
export async function getUseProfileImageSchema() {
  const schemas = await fetchAllPrimarySchemas({ primary: client.proxy })
  return schemas.userProfile.useProfileImageSchema
}

// REVIEW!!!!!!!!!   bind-arguments instead of passing them as arguments to the action
// REVIEW!!!!!!!!!   https://next-safe-action.dev/docs/define-actions/bind-arguments
export async function getApplyMyProfileImageSafeAction({ type, userProfileId }: { userProfileId: userProfileId; type: profileImageType }): Promise<adoptValuedAssetSafeAction> {
  return async function adoptAssetForm_myProfileImage(adoptAssetForm) {
    'use server'
    const applyMyProfileImageAction = defaultSafeActionClient.schema(getUseProfileImageSchema).action(async ({ parsedInput: { type, adoptAssetForm } }) => {
      await client.proxy.userProfile.authenticated.useTempImageAsProfileImage({
        useProfileImageForm: { type, adoptAssetForm },
      })

      revalidatePath(appRoutes(`/profile/${userProfileId}/`))
    })
    return applyMyProfileImageAction({ type, adoptAssetForm })
  }
}

export async function getEditProfileInfoSchema() {
  const allSchemas = await fetchAllPrimarySchemas({ primary: client.proxy })
  return allSchemas.userProfile.editProfileInfoMetaSchema
}

// REVIEW!!!!!!!!!   bind-arguments instead of passing them as arguments to the action
// REVIEW!!!!!!!!!   https://next-safe-action.dev/docs/define-actions/bind-arguments

export async function getUpdateMyProfileInfoMetaSafeAction({ userProfileId }: { userProfileId: userProfileId }): Promise<updateMyProfileInfoSafeAction> {
  return async function updateMyProfileInfoMeta(profileInfoMeta) {
    'use server'
    const updateMyProfileInfoMetaAction = defaultSafeActionClient.schema(getEditProfileInfoSchema).action(async ({ parsedInput: profileInfoMeta }) => {
      await client.proxy.userProfile.authenticated.editProfileInfoMeta({
        profileInfoMeta,
      })
      revalidatePath(appRoutes(`/profile/${userProfileId}/`))
    })
    return updateMyProfileInfoMetaAction(profileInfoMeta)
  }
}
