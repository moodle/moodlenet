'use server'

import { fetchAllPrimarySchemas } from '@moodle/domain/lib'
import { adoptAssetService } from '@moodle/module/content'
import { eduResourceMetaForm } from '@moodle/module/edu'
import { eduResourceDraftId } from '@moodle/module/user-profile'
import { t } from 'i18next'
import { returnValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { redirect, RedirectType } from 'next/navigation'
import { appRoutes } from '../../../lib/common/appRoutes'
import { defaultSafeActionClient, safeActionResult_to_adoptAssetResponse } from '../../../lib/server/safe-action'
import { access } from '../../../lib/server/session-access'

export async function getEduResourceMetaSchema() {
  const { edu } = await fetchAllPrimarySchemas({ primary: access.primary })
  return edu.eduResourceMetaSchema
}

export const saveNewEduResourceDraft = defaultSafeActionClient
  .schema(getEduResourceMetaSchema)
  .action(async ({ parsedInput: eduResourceMetaForm }) => {
    const [done, result] = await access.primary.userProfile.authenticated.createEduResourceDraft({ eduResourceMetaForm })
    if (!done) {
      returnValidationErrors(getEduResourceMetaSchema, {
        _errors: [t(`something went wrong while saving resource meta`)],
      })
    }
    redirect(appRoutes(`/resource/${result.eduResourceDraftId}`), RedirectType.replace)
  })

export async function editEduResourceDraftForId({ eduResourceDraftId }: { eduResourceDraftId: eduResourceDraftId }) {
  return async function editEduResourceDraft(eduResourceMetaForm: eduResourceMetaForm) {
    'use server'
    const editEduResourceDraftAction = defaultSafeActionClient
      .schema(getEduResourceMetaSchema)
      .action(async ({ parsedInput: eduResourceMetaForm }) => {
        'use server'
        const [done /* , result */] = await access.primary.userProfile.authenticated.editEduResourceDraft({
          eduResourceMetaForm,
          eduResourceDraftId,
        })
        if (!done) {
          returnValidationErrors(getEduResourceMetaSchema, {
            _errors: [t(`something went wrong while saving resource meta`)],
          })
        }
        revalidatePath(appRoutes(`/resource/${eduResourceDraftId}`))
      })
    return editEduResourceDraftAction(eduResourceMetaForm)
  }
}

export async function getApplyEduResourceDraftImageSchema() {
  const { edu } = await fetchAllPrimarySchemas({ primary: access.primary })
  return edu.applyImageSchema
}
export async function getEduResourceDraftImageForIdadoptAssetService({
  eduResourceDraftId,
}: {
  eduResourceDraftId: eduResourceDraftId
}): Promise<adoptAssetService> {
  return async function adoptAssetForm_eduResourceDraftImage(adoptAssetForm) {
    'use server'

    const applyEduResourceDraftImageAction = defaultSafeActionClient
      .schema(getApplyEduResourceDraftImageSchema)
      .action(async ({ parsedInput: applyImageForm }) =>
        access.primary.userProfile.authenticated
          .applyEduResourceDraftImage({
            eduResourceDraftId,
            applyImageForm,
          })
          .then(({ adoptAssetResponse }) => {
            revalidatePath(appRoutes(`/resource/${eduResourceDraftId}`))

            return adoptAssetResponse
          }),
      )
    return safeActionResult_to_adoptAssetResponse(applyEduResourceDraftImageAction({ adoptAssetForm }))
  }
}

export async function publishDraftId(eduResourceDraftId: eduResourceDraftId) {
  return async function publish() {
    'use server'
    console.log('publish', eduResourceDraftId)
  }
}
