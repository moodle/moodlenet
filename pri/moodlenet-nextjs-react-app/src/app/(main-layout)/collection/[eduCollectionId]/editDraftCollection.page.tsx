// import CollectionClient from './collection.client'

import { access, getAuthenticatedUserSessionOrRedirectToLogin } from '../../../../lib/server/session-client'
import { pageProps, paramRequired } from '../../../../lib/server/page-props'
import { CollectionPage, collectionPageProps } from '../../../../ui/pages/Collection/Collection'
import { Fallback } from '../../../../ui/pages/Fallback/Fallback'
import { getEduCollectionDraftImageForId_AdoptAssetSafeAction, getEditEduCollectionDraftForId } from '../eduCollection-actions.server'

export default async function EditDraftCollectionPage({ params }: pageProps<{ eduCollectionId: string }>) {
  await getAuthenticatedUserSessionOrRedirectToLogin()
  const eduCollectionId = await paramRequired('eduCollectionId', params)
  const [found, myEduCollectionDraft] = await client.proxy.userProfile.authenticated.getEduCollectionDraft({
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
        saveMeta: await getEditEduCollectionDraftForId({ eduCollectionDraftId: eduCollectionId }),
        applyImage: await getEduCollectionDraftImageForId_AdoptAssetSafeAction({ eduCollectionDraftId: eduCollectionId }),
      },

      publish: null,
    },
    eduCollectionData: myEduCollectionDraft.data,
    contributorCardProps: null,
  }
  return <CollectionPage {...collectionPageProps} />
}
