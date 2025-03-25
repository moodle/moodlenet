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
import session from '../../../lib/server/session-client'

export async function getCreateNewEduResourceSchema() {
  const { edu } = await fetchAllPrimarySchemas({ primary: client.proxy })
  return edu.createNewEduResourceDraftSchema
}

// REVIEW!!!!!!!!!   bind-arguments instead of passing them as arguments to the action
// REVIEW!!!!!!!!!   https://next-safe-action.dev/docs/define-actions/bind-arguments

export async function getCreateNewEduResourceDraft(): Promise<adoptValuedAssetSafeAction> {
  return async function adoptAssetService_newEduResourceFileDraft(newResourceAsset) {
    'use server'
    const createNewEduResourceDraftImageAction = defaultSafeActionClient.schema(getCreateNewEduResourceSchema).action(async ({ parsedInput: newEduResourceForm }) => {
      const [done, result] = await client.proxy.userProfile.authenticated.createEduResourceDraft(newEduResourceForm)
      if (!done) {
        return returnValidationErrors(getCreateNewEduResourceSchema, {
          _errors: [t(`something went wrong while creating resource`)],
        })
      }
      redirect(appRoutes(`/resource/${result.eduResourceDraftId}`))
    })

    return createNewEduResourceDraftImageAction({ newResourceAsset })
  }
}

export async function getEduResourceMetaSchema() {
  const { edu } = await fetchAllPrimarySchemas({ primary: client.proxy })
  return edu.eduResourceMetaSchema
}

// REVIEW!!!!!!!!!   bind-arguments instead of passing them as arguments to the action
// REVIEW!!!!!!!!!   https://next-safe-action.dev/docs/define-actions/bind-arguments

export async function getEditEduResourceDraftForId({ eduResourceDraftId }: { eduResourceDraftId: eduResourceDraftId }) {
  return async function editEduResourceDraft(eduResourceMetaForm: eduResourceMetaForm) {
    'use server'
    const editEduResourceDraftAction = defaultSafeActionClient.schema(getEduResourceMetaSchema).action(async ({ parsedInput: eduResourceMetaForm }) => {
      await client.proxy.userProfile.authenticated.editEduResourceDraft({
        eduResourceMetaForm,
        eduResourceDraftId,
      })
      revalidatePath(appRoutes(`/resource/${eduResourceDraftId}`))
    })
    return editEduResourceDraftAction(eduResourceMetaForm)
  }
}

export async function getApplyEduResourceDraftImageSchema() {
  const { edu } = await fetchAllPrimarySchemas({ primary: client.proxy })
  return edu.applyImageSchema
}

// REVIEW!!!!!!!!!   bind-arguments instead of passing them as arguments to the action
// REVIEW!!!!!!!!!   https://next-safe-action.dev/docs/define-actions/bind-arguments

export async function getEduResourceDraftImageForId_AdoptAssetSafeAction({ eduResourceDraftId }: { eduResourceDraftId: eduResourceDraftId }): Promise<adoptAssetSafeAction> {
  // console.log(`QQ `, { eduResourceDraftId })
  return async function adoptAssetSafeAction_eduResourceDraftImage(resourceImageForm) {
    'use server'
    const applyEduResourceDraftImageAction = defaultSafeActionClient.schema(getApplyEduResourceDraftImageSchema).action(async ({ parsedInput: applyImageForm }) => {
      await client.proxy.userProfile.authenticated.applyEduResourceDraftImage({
        eduResourceDraftId,
        applyImageForm,
      })
      revalidatePath(appRoutes(`/resource/${eduResourceDraftId}`))
    })
    return applyEduResourceDraftImageAction({ resourceImageForm })
  }
}

export async function publishDraftId(eduResourceDraftId: eduResourceDraftId) {
  return async function publish() {
    'use server'
    console.log.publish(eduResourceDraftId)
  }
}
