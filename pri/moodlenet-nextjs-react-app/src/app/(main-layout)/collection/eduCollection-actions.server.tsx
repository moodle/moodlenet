'use server'

import { fetchAllPrimarySchemas } from '@moodle/domain/lib'
import { eduCollectionMetaForm } from '@moodle/module/edu'
import { eduCollectionDraftId } from '@moodle/module/user-profile'
import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { redirect, RedirectType } from 'next/navigation'
import { adoptAssetSafeAction } from '../../../lib/common/actions'
import { appRoutes } from '../../../lib/common/appRoutes'
import { defaultSafeActionClient } from '../../../lib/server/safe-action'
import { access } from '../../../lib/server/session-access'

export async function getEduCollectionMetaSchema() {
  const { edu } = await fetchAllPrimarySchemas({ primary: access.primary })
  return edu.eduCollectionMetaSchema
}

export async function getSaveNewEduCollectionDraft() {
  return async function saveNewEduCollectionDraft(eduCollectionMetaForm: eduCollectionMetaForm) {
    'use server'
    const saveNewEduCollectionDraft = defaultSafeActionClient
      .schema(getEduCollectionMetaSchema)
      .action(async ({ parsedInput: eduCollectionMetaForm }) => {
        const [done, result] = await access.primary.userProfile.authenticated.createEduCollectionDraft({
          eduCollectionMetaForm,
        })
        if (!done) {
          return returnValidationErrors(getEduCollectionMetaSchema, {
            _errors: [t(`something went wrong while saving collection meta`)],
          })
        }
        redirect(appRoutes(`/collection/${result.eduCollectionDraftId}`), RedirectType.replace)
      })

    return saveNewEduCollectionDraft(eduCollectionMetaForm)
  }
}

export async function getEditEduCollectionDraftForId({
  eduCollectionDraftId,
}: {
  eduCollectionDraftId: eduCollectionDraftId
}) {
  return async function editEduCollectionDraft(eduCollectionMetaForm: eduCollectionMetaForm) {
    'use server'
    const editEduCollectionDraftAction = defaultSafeActionClient
      .schema(getEduCollectionMetaSchema)
      .action(async ({ parsedInput: eduCollectionMetaForm }) => {
        'use server'
        await access.primary.userProfile.authenticated.editEduCollectionDraft({
          eduCollectionMetaForm,
          eduCollectionDraftId,
        })

        revalidatePath(appRoutes(`/collection/${eduCollectionDraftId}`))
      })
    return editEduCollectionDraftAction(eduCollectionMetaForm)
  }
}

export async function getApplyEduCollectionDraftImageSchema() {
  const { edu } = await fetchAllPrimarySchemas({ primary: access.primary })
  return edu.applyImageSchema
}
export async function getEduCollectionDraftImageForId_AdoptAssetSafeAction({
  eduCollectionDraftId,
}: {
  eduCollectionDraftId: eduCollectionDraftId
}): Promise<adoptAssetSafeAction> {
  return async function adoptAssetSafeAction_eduCollectionDraftImage(adoptAssetForm) {
    'use server'
    const applyEduCollectionDraftImageAction = defaultSafeActionClient
      .schema(getApplyEduCollectionDraftImageSchema)
      .action(async ({ parsedInput: applyImageForm }) => {
        await access.primary.userProfile.authenticated.applyEduCollectionDraftImage({
          eduCollectionDraftId,
          applyImageForm,
        })
        revalidatePath(appRoutes(`/collection/${eduCollectionDraftId}`))
      })
    return applyEduCollectionDraftImageAction({ resourceImageForm: adoptAssetForm })
  }
}

export async function publishDraftId(eduCollectionDraftId: eduCollectionDraftId) {
  return async function publish() {
    'use server'
    console.log('publish', eduCollectionDraftId)
  }
}
