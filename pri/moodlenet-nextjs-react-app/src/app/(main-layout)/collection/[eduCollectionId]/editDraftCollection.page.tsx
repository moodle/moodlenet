// import CollectionClient from './collection.client'

import { access, getAuthenticatedUserSessionOrRedirectToLogin } from '../../../../lib/server/session-access'
import { params } from '../../../../lib/server/types'
import { CollectionPage, collectionPageProps } from '../../../../ui/pages/Collection/Collection'
import { Fallback } from '../../../../ui/pages/Fallback/Fallback'
import { applyEduCollectionDraftImageForId, editEduCollectionDraftForId } from '../eduCollection-actions.server'

export default async function EditDraftCollectionPage({
  params: { eduCollectionId },
}: {
  params: params<'eduCollectionId'>
}) {
  await getAuthenticatedUserSessionOrRedirectToLogin()
  const [found, myEduCollectionDraft] = await access.primary.userProfile.authenticated.getEduCollectionDraft({
    eduCollectionDraftId: eduCollectionId,
  })
  if (!found) {
    return <Fallback />
  }
  const collectionPageProps: collectionPageProps = {
    activity: 'editDraft',
    actions: {
      // applyImage: null,
      editDraft: {
        saveMeta: await editEduCollectionDraftForId({ eduCollectionDraftId: eduCollectionId }),
        applyImage: await applyEduCollectionDraftImageForId({ eduCollectionDraftId: eduCollectionId }),
      },

      publish: null,
    },
    eduCollectionData: myEduCollectionDraft.data,
    contributorCardProps: null,
  }
  return <CollectionPage {...collectionPageProps} />
}
