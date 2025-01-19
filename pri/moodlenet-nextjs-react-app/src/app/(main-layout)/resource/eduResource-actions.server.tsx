'use server'

import { fetchAllPrimarySchemas } from '@moodle/domain/lib'
import { eduResourceMetaForm } from '@moodle/module/edu'
import { eduResourceDraftId } from '@moodle/module/user-profile'
import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adoptAssetSafeAction, adoptValuedAssetSafeAction } from '../../../lib/common/actions'
import { appRoutes } from '../../../lib/common/appRoutes'
import { defaultSafeActionClient } from '../../../lib/server/safe-action'
import { access } from '../../../lib/server/session-access'

export async function getCreateNewEduResourceSchema() {
  const { edu } = await fetchAllPrimarySchemas({ primary: access.primary })
  return edu.createNewEduResourceDraftSchema
}

export async function getCreateNewEduResourceDraft(): Promise<adoptValuedAssetSafeAction> {
  return async function adoptAssetService_newEduResourceFileDraft(newResourceAsset) {
    'use server'
    const createNewEduResourceDraftImageAction = defaultSafeActionClient
      .schema(getCreateNewEduResourceSchema)
      .action(async ({ parsedInput: newResourceAssetForm }) =>
        access.primary.userProfile.authenticated.createEduResourceDraft(newResourceAssetForm).then(([done, result]) => {
          if (!done) {
            returnValidationErrors(getCreateNewEduResourceSchema, {
              _errors: [t(`something went wrong while saving resource meta`)],
            })
          }
          redirect(appRoutes(`/resource/${result.eduResourceDraftId}`))
        }),
      )
    return createNewEduResourceDraftImageAction({ newResourceAsset })
  }
}

export async function getEduResourceMetaSchema() {
  const { edu } = await fetchAllPrimarySchemas({ primary: access.primary })
  return edu.eduResourceMetaSchema
}

export async function editEduResourceDraftForId({ eduResourceDraftId }: { eduResourceDraftId: eduResourceDraftId }) {
  return async function editEduResourceDraft(eduResourceMetaForm: eduResourceMetaForm) {
    'use server'
    const editEduResourceDraftAction = defaultSafeActionClient
      .schema(getEduResourceMetaSchema)
      .action(async ({ parsedInput: eduResourceMetaForm }) => {
        'use server'
        await access.primary.userProfile.authenticated.editEduResourceDraft({
          eduResourceMetaForm,
          eduResourceDraftId,
        })

        revalidatePath(appRoutes(`/resource/${eduResourceDraftId}`))
      })
    return editEduResourceDraftAction(eduResourceMetaForm)
  }
}

export async function getApplyEduResourceDraftImageSchema() {
  const { edu } = await fetchAllPrimarySchemas({ primary: access.primary })
  return edu.applyImageSchema
}
export async function getEduResourceDraftImageForIdAdoptAssetService({
  eduResourceDraftId,
}: {
  eduResourceDraftId: eduResourceDraftId
}): Promise<adoptAssetSafeAction> {
  return async function adoptAssetService_eduResourceDraftImage(resourceImageForm) {
    'use server'

    const applyEduResourceDraftImageAction = defaultSafeActionClient
      .schema(getApplyEduResourceDraftImageSchema)
      .action(async ({ parsedInput: applyImageForm }) =>
        access.primary.userProfile.authenticated
          .applyEduResourceDraftImage({
            eduResourceDraftId,
            applyImageForm,
          })
          .then(() => {
            revalidatePath(appRoutes(`/resource/${eduResourceDraftId}`))
          }),
      )
    return applyEduResourceDraftImageAction({ resourceImageForm })
  }
}

export async function publishDraftId(eduResourceDraftId: eduResourceDraftId) {
  return async function publish() {
    'use server'
    console.log('publish', eduResourceDraftId)
  }
}
