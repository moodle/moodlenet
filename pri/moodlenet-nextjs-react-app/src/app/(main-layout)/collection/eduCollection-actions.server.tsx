'use server'

import { fetchAllPrimarySchemas } from '@moodle/domain/lib'
import { eduCollectionApplyImageForm, eduCollectionMetaForm } from '@moodle/module/edu'
import { eduCollectionDraftId } from '@moodle/module/user-profile'
import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { redirect, RedirectType } from 'next/navigation'
import { appRoutes } from '../../../lib/common/appRoutes'
import { defaultSafeActionClient, safeActionResult_to_adoptAssetResponse } from '../../../lib/server/safe-action'
import { access } from '../../../lib/server/session-access'
import { adoptAssetService } from '@moodle/module/content'
import { revalidatePath } from 'next/cache'

export async function getEduCollectionMetaSchema() {
  const { edu } = await fetchAllPrimarySchemas({ primary: access.primary })
  return edu.eduCollectionMetaSchema
}

export const saveNewEduCollectionDraft = defaultSafeActionClient
  .schema(getEduCollectionMetaSchema)
  .action(async ({ parsedInput: eduCollectionMetaForm }) => {
    const [done, result] = await access.primary.userProfile.authenticated.createEduCollectionDraft({ eduCollectionMetaForm })
    if (!done) {
      returnValidationErrors(getEduCollectionMetaSchema, {
        _errors: [t(`something went wrong while saving collection meta`)],
      })
    }
    redirect(appRoutes(`/collection/${result.eduCollectionDraftId}`), RedirectType.replace)
  })

export async function editEduCollectionDraftForId({ eduCollectionDraftId }: { eduCollectionDraftId: eduCollectionDraftId }) {
  return async function editEduCollectionDraft(eduCollectionMetaForm: eduCollectionMetaForm) {
    'use server'
    const editEduCollectionDraftAction = defaultSafeActionClient
      .schema(getEduCollectionMetaSchema)
      .action(async ({ parsedInput: eduCollectionMetaForm }) => {
        'use server'
        const [done /* , result */] = await access.primary.userProfile.authenticated.editEduCollectionDraft({
          eduCollectionMetaForm,
          eduCollectionDraftId,
        })
        if (!done) {
          returnValidationErrors(getEduCollectionMetaSchema, {
            _errors: [t(`something went wrong while saving collection meta`)],
          })
        }
        revalidatePath(appRoutes(`/collection/${eduCollectionDraftId}`))
      })
    return editEduCollectionDraftAction(eduCollectionMetaForm)
  }
}

export async function getApplyEduCollectionDraftImageSchema() {
  const { edu } = await fetchAllPrimarySchemas({ primary: access.primary })
  return edu.applyImageSchema
}
export async function getEduCollectionDraftImageForIdadoptAssetService({
  eduCollectionDraftId,
}: {
  eduCollectionDraftId: eduCollectionDraftId
}): Promise<adoptAssetService> {
  return async function adoptAssetForm_eduCollectionDraftImage(adoptAssetForm) {
    'use server'

    const applyEduCollectionDraftImageAction = defaultSafeActionClient
      .schema(getApplyEduCollectionDraftImageSchema)
      .action(async ({ parsedInput: applyImageForm }) =>
        access.primary.userProfile.authenticated
          .applyEduCollectionDraftImage({
            eduCollectionDraftId,
            applyImageForm,
          })
          .then(({ adoptAssetResponse }) => {
            revalidatePath(appRoutes(`/collection/${eduCollectionDraftId}`))

            return adoptAssetResponse
          }),
      )
    return safeActionResult_to_adoptAssetResponse(applyEduCollectionDraftImageAction({ adoptAssetForm }))
  }
}

export async function publishDraftId(eduCollectionDraftId: eduCollectionDraftId) {
  return async function publish() {
    'use server'
    console.log('publish', eduCollectionDraftId)
  }
}
